
const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const logger = require('morgan');
const Price = require('./price');
const fetch = require("node-fetch");
const lodash = require("lodash");

const API_PORT = 9000;

const app = express();
app.use(cors());
app.use(logger('dev'));
const router = express.Router();

// this is our MongoDB database
const dbRoute = 'mongodb://127.0.0.1:27017/products';

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
// this method fetches all available data in our database
router.get('/products/:id', async (req, res) => {
    // get the product name from the other api
    var nameJson = await fetch("http://redsky.target.com/v2/pdp/tcin/" + req.params.id + "?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics")
        .then((res) => {
            return res.json()
        }).catch((err) => {
            res.json({
                error: err
            })
        });

    if (lodash.isEqual(nameJson.product.item, {})) {
        return res.json(nameJson);
    } 

    // get the price from a local noSQL database (MongoDB)
    var priceJson = await Price.findOne({ id: req.params.id });

    // print the data that we have but if there is no price, exclude it
    if (priceJson === null) {
        return res.json({
            id: req.params.id,
            name: nameJson.product.product_description.title,
            current_price: "Could not find price"
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
router.post('/updateData', (req, res) => {
  const { username, password, permission } = req.query;
  if (username === undefined) return res.json({
    success: false,
    username: undefined
  });
  User.findOne({ username: username }, (err, user) => {
    if (err) return res.json({ 
      success: false, 
      error: err 
    });
    if (req.query.username != undefined) user.username = username;
    if (req.query.password != undefined) user.password = password;
    if (req.query.permission != undefined) user.permission = permission;
    user.save();
    return res.json({ 
      success: true,
      updatedUser: user
    });
  });
});

// append /api for our http requests
app.use('/', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));