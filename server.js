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

app.get("/countAdsByLocation", function(req, res){
    mongoDB.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);

        db.collection('ads').aggregate(
            [
                {
                    $group : {
                        _id : { location: "$location" },
                        count: { $sum: 1 }
                    }
                }
            ], function(err, result){
                res.json(result);
                db.close();
            });
    });
});

app.get("/ads/", function(req, res){
    mongoDB.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);
        db.collection('ads').find({}).toArray(function(err, docs) {
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

app.get("/screen/:screenId", function(req, res){
    var screenId = req.params.screenId;
    mongoDB.connect(mongoUrl, function(err,db){
        assert.equal(null, err);

        db.collection('ads').find({screenIds: parseInt(screenId)}).toArray(function(err, docs) {
            assert.equal(null, err);
            res.json(docs);
            db.close();
        });
    });
});

io.sockets.on('connection', function (socket) {

    socket.on('register:screen', function(data){
        // we store the screen id in the socket session for this client
        socket.screenId = data.screenId;
        // add the screenId to the global list
        screens[data.screenId] = data.screenId;
    });

    socket.on('disconnect', function(){
        // remove the screenId from global screens list
        delete screens[socket.screenId];
    });
});
