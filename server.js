var express = require("express")
var http = require('http');
var app = express();
var server = http.createServer(app);

var bodyParser = require('body-parser');
var mongoDB = require('mongodb').MongoClient;
var io = require('socket.io')(server);
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');

var mongoUrl = 'mongodb://localhost:27017/test';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
})); 

var serverPort = 80;
var serverIp = '127.0.0.1';

server.listen({
    host: serverIp,
    port: serverPort
});

var screens = {};
app.use(express.static(__dirname));


// Default route
app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.get("/timePerAd", function(req, res){
    mongoDB.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);
        
        db.collection('stats').aggregate(
           [
              {
                $group : {
                   _id : {id : "$adId", title : "$adTitle"},
                   duration: { $sum: "$duration" }
                }
              }
           ]
        ).toArray(function(err, stats) {
            assert.equal(null, err);
             var sample = [];
            stats.forEach(function(item) { 
                sample.push({'letter' : item._id.title, 'frequency' : item.duration*1.0/60});
            });
            res.json(sample);
            db.close();
        });
   });
});

app.get("/timeUtilizationPerDay", function(req, res){
    mongoDB.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);
        
        db.collection('stats').aggregate(
           [
              {
                $group : {
                   _id : { day: { $dayOfMonth: "$shownAt" } },
                   duration: { $sum: "$duration" }
                }
              }
           ]
        ).toArray(function(err, stats) {
            assert.equal(null, err);
             var sample = [];
            stats.forEach(function(item) { 
                sample.push({'letter' : item._id.day, 'frequency' : item.duration*1.0/60/60/24});
            });
            res.json(sample);
            db.close();
        });
   });
});

app.get("/ads/", function(req, res){
    mongoDB.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);
        
        var query = {};
         
        var screenId = req.query.screenId;
        if (screenId) {
            var screens = req.query.screenId.split(',').map(function (x) {
                return parseInt(x, 10); 
            });
            query = { screenIds : { $in : screens }};
        }
         
        var days = req.query.days;
        if (days) {
            var daysParsed = req.query.days.split(',').map(function (x) {
                return parseInt(x, 10); 
            });
            query['timeFrames.days'] = { $in : daysParsed };
        }
         
        var duration = parseInt(req.query.duration);
        if (duration) {
            query['duration'] = { $gte : duration };
        }

        db.collection('ads').find(query).toArray(function(err, docs) {
            assert.equal(null, err);
            res.json(docs);
            db.close();
        }); 
    });
});

app.post("/ads/", function(req, res){
    mongoDB.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);
        var ad = req.body;
        console.log(ad);
        db.collection('ads').insertOne(ad, function(err){
          console.log(err);
          console.log("Ad Record added as " + ad._id);
          res.json(ad._id);
          io.sockets.emit('ad:added', ad);
          db.close();
        });
    });
});

app.put("/ads/", function(req, res){
    mongoDB.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);
        var ad = req.body;
        ad._id = ObjectId(ad._id);
        console.log(ad);
        db.collection('ads').updateOne({ _id : ObjectId(ad._id) }, ad, function(err){
          console.log(err);
          console.log("Ad Record updated as " + ad._id);
          res.json({ "success" : true });
          io.sockets.emit('ad:updated', ad);
          db.close();
        });
    });
});

app.delete("/ads/:adId", function(req, res){
     var adIdToDelete = req.params.adId;

    mongoDB.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);
        db.collection('ads').removeOne({ _id : ObjectId(adIdToDelete) }, function(err){
          console.log(err);
          console.log("Ad Record delete " + adIdToDelete);
          res.json({ "success" : true });
          db.close();
        });
    });
});

app.get("/ads/:adId", function(req, res){
     var adId = req.params.adId;
     console.log(adId);

    mongoDB.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);

        db.collection('ads').find({ _id : ObjectId(adId) }).toArray(function(err, docs) {
            assert.equal(null, err);
            res.json(docs);
            db.close();
        });
    });
});

io.sockets.on('connection', function (socket) {

    socket.on('register:screen', function(data){
        console.log("Screen Registered: " + data.screenId);
        // we store the screen id in the socket session for this client
        socket.screenId = data.screenId;
        // add the screenId to the global list
        screens[data.screenId] = data.screenId;
    });

    socket.on('ad:shown', function(data) {
        mongoDB.connect(mongoUrl, function(err, db) {
            assert.equal(null, err);
            var stat = data;
            console.log(stat);
            stat.shownAt = new Date();
            db.collection('stats').insertOne(stat, function(err){
                console.log(err);
                console.log("Statistics Record added as " + stat._id);
                db.close();
            });
        });
    });


    socket.on('disconnect', function(){
        console.log("Screen UnRegistered: " + socket.screenId);
        // remove the screenId from global screens list
        delete screens[socket.screenId];
    });

});
