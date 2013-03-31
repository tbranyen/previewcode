// Load external dependencies.
var express = require("express");
var cheerio = require("cheerio");
var Backbone = require("backbone");
var requirejs = require("requirejs");

// Create a new server.
var server = express();

// Reusable API.
var api = require("./api");

// Attach the API.
server.use("/api", api);

// Assign requirejs to require so that existing code using `require` will not
// need to be modified to use `requirejs` instead.
require = requirejs;

// Workaround for RequireJS bug with mapping Node.js module identifiers.
require.define("jquery", function() { return require("cheerio"); });
// Prism does not have a Node version available, so this will make any
// `require("vendor/js/prism")` return undefined.
require.define("vendor/js/prism", function() { });

// Emulate jQuery `hide` and `on`.
cheerio.prototype.hide = cheerio.prototype.on = function() { return this; };

// Since we run the application the top level, need to indicate where the
// application source code lives.
require.config({
  // Ensure the application runs relative to the `app` folder.
  baseUrl: "app",

  // Ensure RequireJS cannot find client modules, want to load these from NPM
  // instead.
  paths: {
    "backbone.layoutmanager": "?",
    "backbone": "?"
  }
});

// Load the application configuration.
require(["config"], function() {

  // Using Grunt's server to handle assets/etc. so we don't need to actually
  // listen twice.
  Backbone.History.prototype.start = function() {};

  // Override the `route` function to bind to express instead.
  Backbone.Router.prototype.route = function(route, name) {
    var router = this;

    // Manually add the route to the beginning supersceding the rest of the
    // already added routes.
    server.get("/" + route, function(req, res) {
      // Run the route.
      router[name].apply(router, _.values(req.params));

      // Once the layout has finished rendering, display.
      router.page.then(function() {
        res.send(Backbone.$.root().html());
      });
    });
  };

//  var Display = require("modules/display");
//
//  // Update the Display Model sync.
//  Display.Model.prototype.sync = function(method, model, options) {
//    if (method === "read") {
//      api.getFileById(model.id, function(results) {
//        model.set(results);
//      });
//    }
//  };

});

// Expose the Express server here so that the Grunt task will be able to attach
// to it.
module.exports = server;
