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

  /*
    function handleFileSelect(evt) {
      evt.stopPropagation();
      evt.preventDefault();

      var files = evt.dataTransfer.files; // FileList object.

      // files is a FileList of File objects. List some properties.
      var output = [];
      for (var i = 0, f; f = files[i]; i++) {
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                    f.size, ' bytes, last modified: ',
                    f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                    '</li>');
      }
      document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    }

    function handleDragOver(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    // Setup the dnd listeners.
    var dropZone = document.getElementById('drop_zone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);

  */

});
