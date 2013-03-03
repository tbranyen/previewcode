define(function(require, Display) {
  
  var app = require("app");

  // Include the syntax highlighting library.
  var Prism = require("vendor/js/prism");

  Display.List = Backbone.View.extend({
    template: "display/list"
  });

  Display.File = Backbone.View.extend({
    template: "display/file",

    afterRender: function() {
      // If Prism has been loaded, highlight everything.
      if (Prism) { 
        Prism.highlightAll();
      }
    }
  });

});
