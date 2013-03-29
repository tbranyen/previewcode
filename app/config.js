// This is the runtime configuration file.  It complements the Gruntfile.js by
// supplementing shared properties.
require.config({
  // Make vendor easier to type.
  paths: {
    "vendor": "../vendor",
    "feature": "../vendor/js/feature"
    //"feature": "../vendor/jam/feature/feature"
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

  feature: {
    // Custom environment overrides.
    environment: {
      // Only load for browser environments.
      "environment/browser": function() {
        return typeof this.window === "object";
      }
    }
  },

  // Include the main application entry point.
  deps: ["app"]
});
