// Load external dependencies.
var fs = require("fs");
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
// Don't want to load the browser on the server.
require.define("browser", function() { });
require.define("vendor/js/prism", function() { });

// Since we run the application the top level, need to indicate where the
// application source code lives.
require.config({ baseUrl: "app" });

// Ensure the configuration is loaded before configuring and loading the rest
// of the application.
require(["config"], function() {
  // Ensure RequireJS cannot find client modules, want to load these from NPM
  // instead.
  require.config({
    paths: {
      "backbone.layoutmanager": "?",
      "backbone": "?"
    },
    baseUrl: "app"
  });

  console.log("here");

  // Setup the application.
  require(["app"], function(app) {
    console.log("here");
    // Emulate jQuery `hide` and `on`.
    cheerio.prototype.hide = cheerio.prototype.on = function() { return this; };

    // Load external dependencies.
    var LayoutManager = require("backbone.layoutmanager");

    // Use cheerio as the Backbone DOM library, load in the main template.
    Backbone.$ = cheerio.load(fs.readFileSync("index.html").toString());

    // Override the `route` function to bind to express instead.
    Backbone.Router.prototype.route = function(route, name) {
      var router = this;

      // Manually add the route to the beginning supersceding the rest of the
      // already added routes.
      console.log('app.root =', app.root);
      server.get(app.root + route, function(req, res) {
        // Run the route.
        router[name].apply(router, _.values(req.params));

        // Once the layout has finished rendering, display.
        router.page.then(function() {
          res.send(Backbone.$.root().html());
        });
      });
    };

    // Using Grunt's server to handle assets/etc. so we don't need to actually
    // listen twice.
    Backbone.History.prototype.start = function() {};

    var Display = require(["modules/display"], function(Display) {
      // Update the Display Model sync.
      Display.Model.prototype.sync = function(method, model, options) {
        if (method === "read") {
          api.getFileById(model.id, function(results) {
            model.set(results);
          });
        }
      };

      // Configure LayoutManager to append ".html".
      LayoutManager.configure({
        fetch: function(path) {
          path += ".html";
          var done = this.async();

          fs.readFile(path, function(err, contents) {
            if (err) {
              console.error("Unable to load file " + path + " : " + err);

              return done(null);
            }

            done(_.template(contents.toString()));
          });
        }
      });
    });
  });
});

// Expose the Express server here so that the Grunt task will be able to attach
// to it.
module.exports = server;
