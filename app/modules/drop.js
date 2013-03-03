define(function(require, Drop) {
  
  var app = require("app");
  var Display = require("modules/display");

  Drop.Zone = Backbone.View.extend({
    template: "drop/zone",
    className: "dropzone-wrapper",

    events: {
      dragover: "handleDragOver",
      drop: "handleDrop"
    },

    handleDragOver: function(ev) {
      ev.originalEvent.dataTransfer.dropEffect = "copy";
      return false;
    },

    handleDrop: function(ev) {
      var files = [];
      var fileList = _.toArray(ev.originalEvent.dataTransfer.files);

      this.readAllFiles(fileList, files, function() {
        // Re-use the same model, wipe out the id first.
        delete app.files.id;

        app.files.set("files", files);

        // Save the model and then redirect to the display page.
        app.files.save().then(function() {
          app.router.navigate("display/" + app.files.id, true);
        });
      });

      return false;
    },

    readAllFiles: function(array, files, callback) {
      if (!array.length) {
        return callback();
      }
      
      var file = array.shift();
      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = function(ev) {
        files.push({
          contents: ev.target.result,
          name: file.name,
          size: file.size,
          type: file.type
        });

        // Recursive.
        this.readAllFiles(array, files, callback);
      }.bind(this);

      // Read in the image file as a data URL.
      reader.readAsText(file);
    }
  });

});
