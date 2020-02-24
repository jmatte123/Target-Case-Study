
const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const logger = require('morgan');
const Price = require('./models/price');
const fetch = require("node-fetch");
const lodash = require("lodash");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.text({type: '*/*'}));
const router = express.Router();

// this is our MongoDB database
const dbRoute = 'mongodb://mongo:27017/products';

// connects our back end code with the database
mongoose.connect(dbRoute, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true, 
  useFindAndModify: false 
});
let db = mongoose.connection;

// connect to the database
db.once('open', () => console.log('connected to the database'));

// this is our get method
// this method fetches the name of the product from an external api and the price from a local noSQL (MongoDB) database
router.get('/products/:id', async (req, res) => {
  // if there is nothing in the request params return nothing
  if (req.params.id === undefined) return res.json({});

  // get the product name from the other api
  var nameJson = await fetch("http://redsky.target.com/v2/pdp/tcin/" + req.params.id)
      .then((res) => {
          return res.json()
      }).catch((err) => {
          res.json({
              error: err
          })
      });

  // check to see if there was a valid product
  if (lodash.isEqual(nameJson.product.item, {})) {
      return res.json(nameJson);
  } 

  // get the price from a local noSQL database (MongoDB)
  var priceJson = await Price.findOne({ id: req.params.id });

  // if there is no price for that id then insert a new document into the database with the given price.  return
  // the json with all the information from the api query.
  if (priceJson === null) {
      var price = new Price({ 
          id: req.params.id,
          value: nameJson.product.price.listPrice.price,
          currency_code: "USD"
      });

      price.save();

      return res.json({
          id: req.params.id,
          name: nameJson.product.product_description.title,
          current_price: {
            value: nameJson.product.price.listPrice.price,
            currency_code: "USD"
          }
      });
  }

  // combine and return the json data
  return res.json({ 
      id: req.params.id,
      name: nameJson.product.item.product_description.title,
      current_price: {
          value: priceJson.value,
          currency_code: priceJson.currency_code
      }
  });
});


// this is our update method
// this method overwrites existing data in our database
router.put('/products/:id', async (req, res) => {
  // find the price in the database
  await Price.findOne({ id: req.params.id }, (err, price) => {
    if (err) return res.json({ 
      success: false, 
      error: err 
    });
    // get the values of the request body
    const { value, currency_code } = JSON.parse(req.body);

    // change them if they are there
    if (value !== undefined) price.value = value;
    if (currency_code !== undefined) price.currency_code = currency_code;

    // save them back to the database
    price.save();

    // return the new price and the currency code (or whatever is in the database)
    return res.json({ 
      success: true,
      updated_price: price.value,
      updated_currency_code: price.currency_code
    });
  });
});

// append /api for our http requests
app.use('/', router);

// launch our backend into a port
app.listen(4000, () => console.log(`LISTENING ON PORT 4000`));