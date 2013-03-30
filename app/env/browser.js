define(function(require) {
  
  // Configure LayoutManager with browser defaults.
  require("backbone.layoutmanager").configure({
    // Allow LayoutManager to augment Backbone.View.prototype.
    manage: true,

    // Indicate where templates are stored.
    prefix: "app/templates/",

    // Detect if the View was rendered on the server.
    render: function(template, context) {
      console.log(this);
      return template(context);
    },

    // This custom fetch method will load pre-compiled templates or fetch them
    // remotely with AJAX.
    fetch: function(path) {
      // Concatenate the file extension.
      path = path + ".html";

      // If cached, use the compiled template.
      if (window.JST && window.JST[path]) {
        return window.JST[path];
      }

      // Put fetch into `async-mode`.
      var done = this.async();

      // Seek out the template asynchronously.
      $.get(require("app").root + path, function(contents) {
        done(_.template(contents));
      }, "text");
    }
  });

});
