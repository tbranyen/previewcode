define(function(require) {

  // Application.
  var app = require("app");

  // Modules.
  var Layout = require("modules/layout");
  var Drop = require("modules/drop");
  var Display = require("modules/display");

  // Defining the application router, you can attach sub routers here.
  return Backbone.Router.extend({
    routes: {
      "": "drop",
      "display/:id": "display",
      "display/:id/:idx": "display"
    },
    
    setPage: function(name, options) {
      // If an existing page exists, clear out the children.
      if (this.page) {
        this.page.view.removeView();
      }

      // Save this page layout.
      this.page = new Backbone.Layout(_.extend({
        el: "main", template: name
      }, options)).render();

      // Swap out the layout data-attr.  Need to use `attr` here, because data
      // will only set in memory which means it wouldn't be set on the element
      // on the server.
      this.page.view.$el.attr("data-layout", name);

      return this.page.view;
    },

    drop: function() {
      this.setPage("drop", {
        views: {
          nav: new Layout.Navigation(),
          section: new Drop.Zone()
        }
      });
    },

    display: function(id, idx) {
      app.files.set("id", id);
      app.files.fetch();

      this.setPage("display", {
        views: {
          nav: new Layout.Navigation(),
          aside: new Display.List({ files: app.files }),
          section: new Display.File({ idx: idx || 0, files: app.files })
        }
      }).on("showFile", function(idx) {
        this.getView("section").contents = app.files.get("files")[idx].contents;
        this.getView("section").render();
      });
    },

    initialize: function() {
      app.files = new Display.Model();

      this.on("route", function() {
        // Don't remember why I need this.
      });
    }
  });

});
