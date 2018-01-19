var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function(req, res){
  var hotelId = req.params.hotelId;
  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, doc){
      if (err) {
        console.log("Errore nel trovare le reviews");
        res
        .status(500)
        .json(err);
      } else if(!doc){
        res
        .status(404)
        .json({"message" : "HotelId non trovato"});
      }
      if(doc){
      console.log("Returned doc", doc);
      res
      .status(200)
      .json(doc.reviews);
    }
  });
};

module.exports.reviewsGetOne = function(req, res){
  var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;
  console.log(`GET reviewId ${reviewId} for hotelId ${hotelId}`);
  Hotel
  .findById(hotelId)
  .select('reviews')
  .exec(function(err, hotel){
    if (err) {
      console.log("Errore nel trovare le reviews");
      res
        .status(500)
        .json(err);
    } else if(!hotel){
      res
        .status(404)
        .json({"message" : "HotelId non trovato"});
        return;
    }
    console.log("Returned hotel", hotel);
    var review = hotel.reviews.id(reviewId);
    if (!review) {
      console.log("Per questo hotel non esiste la review cercata");
      res
        .status(404)
        .json({"message" : "Per questo hotel non esiste la review cercata"})
    } else{
    res
    .status(200)
    .json(review);
  }
  });
};

var _addReview = function(req, res, hotel){
  hotel.reviews.push({
    name: req.body.name,
    review: req.body.review ,
    rating: parseInt(req.body.rating, 10)
  });
  hotel.save(function(err, hotelUpdated){
    if(err){
      res
        .status(500)
        .json(err);
    } else {
      res
      .status(201)
      .json(hotelUpdated.reviews[hotelUpdated.reviews.length - 1]);
    }
  });
};

module.exports.reviewsAddOne = function(req, res){
  var hotelId = req.params.hotelId;
  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, doc){
      if (err) {
        console.log("Errore nel trovare gli hotels");
        res
        .status(500)
        .json(err);
      } else if(!doc){
        console.log("HotelId non trovato nel database");
        res
        .status(404)
        .json({"message" : "HotelId non trovato"});
      }
      if(doc){
        _addReview(req, res, doc);
      }
  });
};

module.exports.reviewsUpdateOne = function(req, res){
  var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;
  console.log(`PUT reviewId ${reviewId} for hotelId ${hotelId}`);
  Hotel
  .findById(hotelId)
  .select('reviews')
  .exec(function(err, hotel){
    if (err) {
      console.log("Errore nel trovare questo hotel");
      res
        .status(500)
        .json(err);
    } else if(!hotel){
      console.log("Hotel id non trovato", id);
      res
        .status(404)
        .json({"message" : "HotelId non trovato"});
        return;
    }
    console.log("Returned hotel", hotel);
    var review = hotel.reviews.id(reviewId);
    if (!review) {
      console.log("Per questo hotel non esiste la review cercata");
      res
        .status(404)
        .json({"message" : "Per questo hotel non esiste la review cercata"})
    } else{
    if(req.body.name){
      review.name = req.body.name;
    }
    if(req.body.rating){
      review.rating = parseInt(req.body.rating, 10);
    }
    if(req.body.review){
      review.review = req.body.review;
    }

    hotel.save(function(err, hotelUpdated){
      if(err){
        res
          .status(500)
          .json(err);
      } else {
        res
        .status(204)
        .json();
      }
    });
  }
  });
};


module.exports.reviewsDeleteOne = function(req, res){
  var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;
  console.log(`PUT reviewId ${reviewId} for hotelId ${hotelId}`);
  Hotel
  .findById(hotelId)
  .select('reviews')
  .exec(function(err, hotel){
    if (err) {
      console.log("Errore nel trovare questo hotel");
      res
        .status(500)
        .json(err);
    } else if(!hotel){
      console.log("Hotel id non trovato", id);
      res
        .status(404)
        .json({"message" : "HotelId non trovato"});
        return;
    }
    console.log("Returned hotel", hotel);
    var review = hotel.reviews.id(reviewId);
    if (!review) {
      console.log("Per questo hotel non esiste la review cercata");
      res
        .status(404)
        .json({"message" : "Per questo hotel non esiste la review cercata"})
    } else{
    hotel.reviews.id(reviewId).remove();

    hotel.save(function(err, hotelUpdated){
      if(err){
        res
          .status(500)
          .json(err);
      } else {
        res
        .status(204)
        .json();
      }
    });
  }
  });
};
