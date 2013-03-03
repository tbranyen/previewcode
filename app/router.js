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
      "display/:id": "display"
    },
    
    useLayout: function(name, options) {
      if (this._layout) {
        // Clear out the children.
        this._layout.removeView();
      }

      // Save this layout.
      this._layout = new Backbone.Layout(_.extend({
        el: "main", template: name
      }, options));

      // Swap out the layout data-attr.  Need to use `attr` here, because data
      // will only set in memory which means it wouldn't be set on the element
      // on the server.
      this._layout.$el.attr("data-layout", name);

      return this._layout;
    },

    drop: function() {
      this.layout = this.useLayout("drop", {
        views: {
          nav: new Layout.Navigation(),
          section: new Drop.Zone()
        }
      }).render();
    },

    display: function(id, lol) {
      this.layout = this.useLayout("display", {
        views: {
          nav: new Layout.Navigation(),
          aside: new Display.List(),
          section: new Display.File()
        }
      }).render();
    }
  });

});
