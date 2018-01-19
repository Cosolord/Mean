var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

var runGeoQuery = function(req, res) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);

  //A geoJSON point
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: 2000,
    num: 5
  };

  Hotel
    .geoNear(point, geoOptions, function(err, results, stats) {
      console.log("Geo results", results);
      console.log("Geo stats", stats);
      res
        .status(200)
        .json(results);
    });
};

module.exports.hotelsGetAll = function(req, res) {
  var offset = 0;
  var count = 5;
  var maxCount = 10;

  if (req.query && req.query.lat && req.query.lng) {
    runGeoQuery(req, res);
    return;
  }

  if (req.query && req.query.offset) {
    offset = parseInt(req.query.offset, 10);
  }
  if (req.query && req.query.count) {
    count = parseInt(req.query.count, 10);
  }

  if (req.query && req.query.maxCount) {
    maxCount = parseInt(req.query.maxCount, 10);
  }

  if (isNaN(offset) || isNaN(count)) {
    res
      .status(400)
      .json({
        "message" : "Se inseriti nella query, count e offset devono essere numeri"
      });
    return;
  }

  if (count > maxCount) {
    res
      .status(400)
      .json({"message": "Count (" + count + ") è maggiore di maxCount (" + maxCount + ")"});
      return;

  }

  Hotel
    .find()
    .skip(offset)
    .limit(count)
    .exec(function(err, hotels) {
      if (err) {
        console.log("Errore nel trovare gli hotels");
        res
        .status(500)
        .json(err)
      } else{
      console.log("Hotel trovati: ", hotels.length);
      res
        .json(hotels);
      }
    });
};

module.exports.hotelsGetOne = function(req, res) {
  var hotelId = req.params.hotelId;
  console.log("GET hotelId:", hotelId);

  Hotel
    .findById(hotelId)
    .exec(function(err, doc) {
      var response = {
        status: 200,
        message: doc
      };
      if (err) {
        console.log("Errore nel trovare questo hotel");
        response.status = 500;
        response.message = err;
      } else if (!doc) {
        response.status = 404;
        response.message = {"message" : "HotelId non trovato"};
      }
      res
        .status(response.status)
        .json(response.message);
    });
};

var _splitArray = function(input){
  var output;
  if(input && input.length>0){
    output= input.split(";");
  } else {
    output = [];
  }
  return output;
};

module.exports.hotelsAddOne = function(req, res) {
  Hotel
    .create({
      name: req.body.name,
      stars: parseInt(req.body.stars, 10),
      services: _splitArray(req.body.services),
      description: req.body.description,
      photos: _splitArray(req.body.photos),
      currency: req.body.currency,
      location: {
        address: req.body.address,
        coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lng)]
      }
    }, function(err, hotel){
      if (err) {
        console.log("Errore nel creare l'hotel");
        res
          .status(400)
          .json(err);
      } else {
        console.log("Hotel creato", hotel);
        res
          .status(201)
          .json(hotel);
      }
    });
};

module.exports.hotelsUpdateOne = function(req, res){
  var hotelId = req.params.hotelId;
  console.log("GET hotelId:", hotelId);

  Hotel
    .findById(hotelId)
    .select("-reviews -rooms")
    .exec(function(err, doc) {
      var response = {
        status: 200,
        message: doc
      };
      if (err) {
        console.log("Errore nel trovare questo hotel");
        response.status = 500;
        response.message = err;
      } else if (!doc) {
        response.status = 404;
        response.message = {"message" : "HotelId non trovato"};
      }
      if (response.status !==200){
        res
        .status(response.status)
        .json(response.message);
      } else {
        if(req.body.name){
          doc.name = req.body.name;
        }
        if(req.body.stars){
          doc.stars = parseInt(req.body.stars, 10);
        }
        if(req.body.services){
          doc.services = req.body.services;
        }
        if(req.body.description){
          doc.description = req.body.description;
        }
        if(req.body.photos){
          doc.photos = req.body.photos;
        }
        if(req.body.currency){
          doc.currency = req.body.currency;
        }
        if(req.body.location){
          doc.location = {
            address: req.body.address,
            coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lng)]
          };
        }
        doc.save(function(err, updatedHotel){
          if(err){
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        })
      }
    });
};

module.exports.hotelsDeleteOne = function(req, res){
  var hotelId =  req.params.hotelId;

  Hotel
    .findByIdAndRemove(hotelId)
    .exec(function(err, hotel){
      if(err){
        res
          .status(404)
          .json(err);
      }else {
        console.log("Hotel cancellato, id:", hotelId);
        res
          .status(204)
          .json();
      }
    });
};
