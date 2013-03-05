// This is the runtime configuration file.  It complements the Gruntfile.js by
// supplementing shared properties.
require.config({
  // Make vendor easier to type.
  paths: {
    "vendor": "../vendor"
  },

  shim: {
    // Export Prism.
    "vendor/js/prism": {
      exports: "Prism"
    },

    // Ensure the Jam configuration is loaded before configuring and loading
    // the rest of the application.
    "app": ["vendor/jam/require.config"]
  },

  // Include the main application entry point.
  deps: ["app"]
});
