
var express = require("express");
var app = express(); // express.createServer();
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';
var io = require('socket.io')(server);

app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
})); 

server.listen(8080);

var screens = {};

io.sockets.on('connection', function (socket) {

  socket.on('register:screen', function(data){
    console.log("Screen Registered: " + data.screenId);
    // we store the screen id in the socket session for this client
    socket.screenId = data.screenId;
    // add the screenId to the global list
    screens[data.screenId] = data.screenId;
  });

  socket.on('ad:shown', function(data) { 
     MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        var stat = data;
        console.log(stat);
        stat.shownAt = new Date();
        db.collection('stats').insert(stat, function(err){
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

var insertDocuments = function(db, callback) {
   db.collection('ads').insertMany([{
      "title" : "הודעה 1",
      "textLines" : ['שורה ראשונה שורה ראשונה', 'שורה שניה שורה שניה'
                   , 'שורה שלישית שורה שלישית', 'שורה רביעית שורה רביעית'],
      "images" : ['./images/cats.jpg', './images/animal.jpg'],
      "templateUrl" : './templateA.html',
      "duration" :1*60*60*12,
      "timeFrames" : [
          { 
              "startDate" : "7/12/15",
              "endDate" : "12/31/15",
              "days" : [2,3,4,5,6],
              "from" : "6:00 AM",
              "to" : "11:59 PM"
          },
          { 
              "startDate" : "1/1/15",
              "endDate" : "12/31/15",
              "days" : [4],
              "from" : "1:00 PM",
              "to" : "8:00 PM"
          }
      ],
      "screenIds" : [1,2]
   },{
     "title" : "הודעה 2",
      "textLines" : ['שורה ראשונה שורה ראשונה', 'שורה שניה שורה שניה',
                   'שורה שלישית שורה שלישית', 'שורה רביעית שורה רביעית',
                  'שורה חמישית שורה חמישית', 'שורה שישית שורה שישית',
                  'שורה שביעית שורה שביעית', 'שורה שמינית שורה שמינית',
                  'שורה תשיעית שורה תשיעית', 'שורה עשירית שורה עשירית'],
      "images" : ['./images/sea.jpg'],
     "templateUrl" : './templateB.html',
      "duration" : 30,
      "timeFrames" : [
          { 
               "startDate" : "3/1/15",
              "endDate" : "7/30/15",
              "days" : [3,4,6],
              "from" : "8:00 AM",
              "to" : "4:00 PM"
          }
      ],
      "screenIds" : [1,3]
  }, {
     "title" : "הודעה 3",
     "textLines" : [],
      "images" : [],
      "videos" : ['http://media.w3.org/2010/05/sintel/trailer.mp4'],
      "templateUrl"  : './templateC.html',
      "duration" : 20,
     "timeFrames" : [
          { 
               "startDate" : "7/18/15",
              "endDate" : "7/25/15",
              "days" : [1,2,3,4,5,6,7],
              "from" : "8:00 AM",
              "to" : "10:00 PM"
          }
      ],
      "screenIds" : [2,3]
  }, {
      "title" : "הודעה 4",
      "textLines" : ['שורה ראשונה שורה ראשונה', 'שורה שניה שורה שניה'],
      "images" : [],
       "templateUrl" : './templateA.html',
      "duration" : 20,
      "timeFrames" : [
          { 
               "startDate" : "3/29/15",
              "endDate" : "9/15/15",
              "days" : [2,6],
              "from" : "7:00 AM",
              "to" : "7:00 PM"
          }
      ],
       "screenIds": [1]
  }, {
     "title" : "הודעה 5",
      "textLines" : ['שורה ראשונה שורה ראשונה', 'שורה שניה שורה שניה',
                   'שורה שלישית שורה שלישית', 'שורה רביעית שורה רביעית',
                  'שורה חמישית שורה חמישית', 'שורה שישית שורה שישית',
                  'שורה שביעית שורה שביעית'],
       "images": ['./images/catedral.jpg', './images/animal.jpg'],
      "templateUrl" : './templateB.html',
      "duration" : 30,
      "timeFrames" : [
          { 
               "startDate" : "7/1/15",
              "endDate" : "9/30/15",
              "days" : [2,3,4,6],
              "from" : "1:00 AM",
              "to" : "11:00 PM"
          }
      ],
      "screenIds": [3]
  }], function(err, result) {
    assert.equal(err, null);
    console.log("Inserted  documents into the ads collection.");
    callback(result);
  });
};

var removeDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('ads');
  // Insert some documents
  collection.removeMany({}, function(err, result) {
    assert.equal(err, null);
    console.log("Delete all ads");
    callback(result);
  });    
};

var removeStats = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('stats');
  // Insert some documents
  collection.removeMany({}, function(err, result) {
    assert.equal(err, null);
    console.log("Delete all statistics");
    callback(result);
  });    
};


MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
    removeDocuments(db,function() {
      insertDocuments(db, function() {
         // removeStats(db, function() {
            db.close();
         // });
      });
    });
});

app.use(express.static(__dirname));

app.get("/timePerAd", function(request, response){
    MongoClient.connect(url, function(err, db) {
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
            response.json(sample);
            db.close();
        });
   });
});

app.get("/timeUtilizationPerDay", function(request, response){
    MongoClient.connect(url, function(err, db) {
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
            response.json(sample);
            db.close();
        });
   });
});

app.get("/ads/", function(request, response){
     MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        
        var query = {};
         
        var screenId = request.query.screenId;
        if (screenId) {
            var screens = request.query.screenId.split(',').map(function (x) { 
                return parseInt(x, 10); 
            });
            query = { screenIds : { $in : screens }};
        }
         
        var days = request.query.days;
        if (days) {
            var daysParsed = request.query.days.split(',').map(function (x) { 
                return parseInt(x, 10); 
            });
            query['timeFrames.days'] = { $in : daysParsed };
        }
         
        var duration = parseInt(request.query.duration);
        if (duration) {
            query['duration'] = { $gte : duration };
        }

        db.collection('ads').find(query).toArray(function(err, docs) {
            assert.equal(null, err);
            response.json(docs);
            db.close();
        }); 
    });
});

app.post("/ads/", function(request, response){
     MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        var ad = request.body;
        console.log(ad);
        db.collection('ads').insert(ad, function(err){
          console.log(err);
          console.log("Ad Record added as " + ad._id);
          response.json(ad._id);
          io.sockets.emit('ad:added', ad);
          db.close();
        });
    });
});

app.put("/ads/", function(request, response){
     MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        var ad = request.body;
        ad._id = ObjectId(ad._id);
        console.log(ad);
        db.collection('ads').update({ _id : ObjectId(ad._id) }, ad, function(err){
          console.log(err);
          console.log("Ad Record updated as " + ad._id);
          response.json({ "success" : true });
          io.sockets.emit('ad:updated', ad);
          db.close();
        });
    });
});

app.delete("/ads/:adId", function(request, response){
     var adIdToDelete = request.params.adId;
    
     MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('ads').remove({ _id : ObjectId(adIdToDelete) }, function(err){
          console.log(err);
          console.log("Ad Record delete " + adIdToDelete);
          response.json({ "success" : true });
          db.close();
        });
    });
});

app.get("/ads/:adId", function(request, response){
     var adId = request.params.adId;
     console.log(adId);
    
     MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);

        db.collection('ads').find({ _id : ObjectId(adId) }).toArray(function(err, docs) {
            assert.equal(null, err);
            response.json(docs);
            db.close();
        });
    });
});

app.get("/", function(request, response){
    response.sendFile(__dirname + "/index.html");
});
