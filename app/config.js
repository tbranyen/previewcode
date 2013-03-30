// This is the runtime configuration file.  It complements the Gruntfile.js by
// supplementing shared properties.
require.config({
  // Make vendor easier to type.
  paths: {
    "vendor": "../vendor",

    // This plugin is used to conditionally load features.
    "feature": "../vendor/js/feature"
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
    env: {
      "env/browser": function() {
        return typeof window === "object";
      },

      "env/node": function() {
        return typeof process === "object" && process.title === "node";
      }
    }
  },

  deps: ["app"]
});

// Wait for the environment to be set up before running the application.
require(["feature!env"], function(env) {
  require(["main"]);
});
