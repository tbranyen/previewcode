// Libraries.
var redis = require("redis");
var uuid = require("uuid");
var express = require("express");

// Create new API site.
var site = express();
// Create new Redis connection.
var client = redis.createClient();

// Set the max file size.
site.use(express.limit(200000));

// Ensure bodyParser is enabled for POSTs.
site.use(express.bodyParser());

// Get file information by uuid.
site.getFileById = function(id, callback) {
  client.get(id, function(err, results) {
    callback(JSON.parse(results));
  });
};

// Respond with the file information.
site.get("/files/:id", function(req, res) {
  site.getFileById(req.params.id, function(results) {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(results));
  });
});

// Send up a file.
site.post("/files", function(req, res) {
  // Get files into JSON.
  var id = uuid.v1();

  // Set the ID of the model.
  req.body.id = id;

  var json = JSON.stringify(req.body);
  client.set(id, json);
  // Send the new UUID.
  res.send(json);
});

module.exports = site;
