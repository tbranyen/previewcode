/* AMD Feature Plugin v0.1.0
 * Copyright 2013, Tim Branyen (@tbranyen), based on original work by jensarps.
 * feature.js may be freely distributed under the MIT license.
 */
(function(global) {

// Cache used to map configuration options between load and write.
var buildMap = {};

define({
  version: "0.1.0",

  // Invoked by the AMD builder, passed the path to resolve, the require
  // function, done callback, and the configuration options.
  load: function(name, req, load, config) {
    // Dojo provides access to the config object through the `req` function.
    if (!config) {
      config = require.rawConfig;
    }

    if (!config.feature) {
      return;
    }

    // Detect the specific feature.
    var feature = config.feature[name];

    // No feature to load, throw.
    if (!feature) {
      throw new TypeError("Feature '" + name + "' is undefined or does not" +
        " have a `feature` config. Make sure it exists, add a `feature`" +
        " config, or don't use feature! on it");
    }

    // Attach to the build map for use in the write method below.
    buildMap[name] = { feature: feature };

    // Okay so yea, technically keys could be out of order.  We all know this,
    // but sometimes you just gotta reach for whatever and do whatever.
    for (var name in feature) {
      // Ensure we only iterate over Object properties.
      if (!feature.hasOwnProperty(name)) { continue; }

      // Get the callback to test.
      var callback = feature[name];

      // In a build context, do not load any features.
      if (config.isBuild) {
        load();

        continue;
      }

      // Test the callback, use the first one to pass.  If a callback was not
      // provided, try testing for truthiness of the value.
      if (typeof callback === "function" ? callback.call(global) : callback) {
        // Bring in the correct module.
        req([name], load);

        // End looping.
        break;
      }
    }
  },

  // Also invoked by the AMD builder, this writes out a compatible define
  // call that will work with loaders such as almond.js that cannot read
  // the configuration data.
  write: function(pluginName, featureName, write) {
    var feature = buildMap[featureName].feature;

    // Add the starting JSON bracket.
    var features = ["{"];

    // Convert all test functions to strings.
    for (var name in feature) {
      // ensure we only iterate over object properties.
      if (!feature.hasOwnProperty(name)) { continue; }

      // Add this feature to the source.
      features.push("'" + name + "': " + feature[name].toString() + ",");
    }

    // Remove the last comma.
    features[features.length-1] = features[features.length-1].slice(0, -1);

    // Add the last bracket.
    features.push("}");

    function findFeature() {
      for (var name in feature) {
        // Ensure we only iterate over object properties.
        if (!feature.hasOwnProperty(name)) { continue; }

        // Get the callback to test.
        var callback = feature[name];

        // Test the callback, use the first one to pass.  If a callback was not
        // provided, try testing for truthiness of the value.
        if (typeof callback === "function" ? callback.call(window) : callback) {
          // Bring in the correct module.
          return require(name);
        }
      }
    }

    // Write out the actual definition
    write([
      "define('", pluginName, "!", featureName, "', [], function() {",
        // Set all the features.
        "var feature = ", features.join(""), ";",

        // Find the correct feature and auto-run it.
        "return (", findFeature.toString(), ")", "();",
      "});\n"
    ].join(""));
  }
});

})(typeof global === "object" ? global : this);
