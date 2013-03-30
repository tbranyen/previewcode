define(function(require, exports, module) {

  var _ = require("underscore");
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Router = require("router");
  var LayoutManager = require("backbone.layoutmanager");
  
  // The application object is just a LayoutManager View.
  var app = new Backbone.Layout({
    el: "body",

    events: {
      "click a[href]:not([data-bypass])": "hijackLinks"
    },

    hijackLinks: function(ev) {
      var target = ev.currentTarget;
      // Get the absolute anchor href.
      var href = { prop: $(target).prop("href"), attr: $(target).attr("href") };
      // Get the absolute root.
      var root = location.protocol + "//" + location.host + app.root;

      // Ensure the root is part of the anchor href, meaning it's relative.
      if (href.prop.slice(0, root.length) === root) {
        // Stop the default event to ensure the link will not cause a page
        // refresh.
        ev.preventDefault();

        // `Backbone.history.navigate` is sufficient for all Routers and will
        // trigger the correct events. The Router's internal `navigate` method
        // calls this anyways.  The fragment is sliced from the root.
        Backbone.history.navigate(href.attr, true);
      }
    }
  });

  // The root path to run the application through.
  app.root = "/";

  // Expose this object for other modules if they need it.
  module.exports = app;

});
