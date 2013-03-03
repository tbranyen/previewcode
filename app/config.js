// This is the runtime configuration file.  It complements the Gruntfile.js by
// supplementing shared properties.
requirejs.config({
  // Put additional configuration options here.
  paths: {
    "vendor": "../vendor"
  },

  // Load the browser module first to add client-side only code, this is
  // replaced on the server with an empty module.
  deps: ["browser", "main"],

  // Export Prism.
  shim: {
    "vendor/js/prism": {
      exports: "Prism"
    }
  }
});

// Ensure the Jam configuration is loaded before configuring and loading the
// rest of the application.
define(["vendor/jam/require.config"], function() {});
