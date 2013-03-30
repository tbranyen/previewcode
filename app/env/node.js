define(function() {

  var fs = require("fs");
  var app = require("app");
  var cheerio = require("cheerio");
  var Backbone = require("backbone");

  // Configure LayoutManager with server defaults.
  require("backbone.layoutmanager").configure({
    manage: true,

    prefix: "app/templates/",

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

  // Use cheerio as the Backbone DOM library, load in the main template.
  Backbone.$ = cheerio.load(fs.readFileSync("index.html").toString());

});
