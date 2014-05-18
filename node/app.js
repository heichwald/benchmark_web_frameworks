var express = require('express');
var http = require('http');
var app = express();
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
// Set up the connection to the local db
var mongodb = require('mongodb') 
  , MongoClient = mongodb.MongoClient
var db;

// PUBLIC ROUTES
// Health Check
app.get('/server/test.html', function (req, res) {
  res.write('OK');
  res.end();
});

app.get('/mongo', function (req, res) {
  db.collection('articles').findOne({}, function(err, doc) {
    res.send(doc);
  });
});




http.globalAgent.maxSockets = 100000;
if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', function (worker, code, signal) {
    console.log('worker %d died (%s). restarting...',
      worker.process.pid, signal || code);
    cluster.fork();
  });
} else {
  var url = "mongodb://192.168.0.7:27017/articles/?maxPoolSize=1500";
  MongoClient.connect(url, function(err, database) {
    if(err){
      throw err;
    }else{
      db = database;
      console.log("Connected to Mongo");
      // Workers can share any TCP connection
      // In this case its a HTTP server
      http.createServer(app).listen(5000, function () {
        console.log("Express server listening on port 5000");
      });
    }
  });
}
