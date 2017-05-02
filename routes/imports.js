module.exports = function(app, security) {
  var api = require('../api')
    , access = require('../access')
    , fs = require('fs-extra')
    , path = require('path')
    , environment = require('environment')
    , toGeoJson = require('../utilities/togeojson');

  var passport = security.authentication.passport;

  function verifyLayer(req, res, next) {
    if (req.layer.type !== 'Feature' && req.layer.type !== 'GeoPackage') {
      return res.status(400).send("Cannot import data, layer type is not 'Static'");
    }

    return next();
  }

  function readImportFile(req, res, next) {
    // TODO at some point open file and determine type (KML, shapefile, geojson, csv)

    fs.readFile(req.files.file.path, 'utf8', function(err, data) {
      req.importData = data;
      return next(err);
    });
  }

  app.post(
    '/api/layers/:layerId/kml',
    passport.authenticate('bearer'),
    access.authorize('CREATE_LAYER'),
    verifyLayer,
    readImportFile,
    function(req, res, next) {
      var features = toGeoJson.kml(req.importData);
      new api.Feature(req.layer).createFeatures(features, function(err, newFeatures) {
        if (err) return next(err);

        var response = {
          files: [{
            name: req.files.file.originalname,
            size: req.files.file.size,
            features: newFeatures.length
          }]
        };

        res.json(response);
      });
    }
  );

  app.post(
    '/api/layers/:layerId/gpkg',
    passport.authenticate('bearer'),
    access.authorize('CREATE_LAYER'),
    verifyLayer,
    readImportFile,
    function(req, res, next) {
      var finalDir = path.join(environment.attachmentBaseDirectory, req.layer.id);
      var finalPath = path.join(finalDir, 'geopackage.gpkg');
      fs.mkdirp(finalDir, function(err) {
        fs.copy(req.files.file.path, finalPath, function() {
          if (err) return next(err);

          var response = {
            files: [{
              finalPath: finalPath,
              name: req.files.file.originalname,
              size: req.files.file.size
            }]
          };

          res.json(response);
        });
      });
    }
  );
};
