var express = require('express');
var router = express.Router();
var ctrlHotels = require('../controllers/hotels_controllers.js');

router
  .route('/hotels')
  .get(ctrlHotels.hotelsGetAll)
  .post(function(req, res){
    console.log('POST json');
    res
      .status(200)
      .json({"jsonData": "POST received"});
  });

router
  .route('/hotels/:hotelId')
  .get(ctrlHotels.hotelsGetOne);

module.exports = router;
