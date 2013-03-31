// This is the runtime configuration file.  It complements the Gruntfile.js by
// supplementing shared properties.
require.config({
  paths: {
    // Make vendor easier to access.
    "vendor": "../vendor",

    // This plugin is used to conditionally load features.
    //
    // TODO Add this to JamJS and remove from configuration.
    "feature": "../vendor/js/feature"
  },

  shim: {
    // Export Prism.
    //
    // TODO Add Prism to JamJS so that this can be removed.
    "vendor/js/prism": {
      exports: "Prism"
    },

    // Ensure the Jam configuration is loaded before configuring and loading
    // the rest of the application.
    //
    // TODO Talk to @jrburke and figure out how we can address this hack to
    // load multiple configurations.
    "main": ["vendor/jam/require.config"]
  },

  feature: {
    environment: {
      "environments/browser": function() {
        return typeof window === "object";
      },

      "environments/node": function() {
        return typeof process === "object" && process.title === "node";
      }
    }
  },

  // Ensure the application is loaded.
  deps: ["main"]
});
