
const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const logger = require('morgan');

const API_PORT = 9000;

const app = express();
app.use(cors());
app.use(logger('dev'));
const router = express.Router();

// this is our MongoDB database
const dbRoute = 'mongodb://127.0.0.1:27017/UserAuth';

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
router.get('/getUsers', async (req, res) => {
  var peopleJSON = await User.find({});
  if (peopleJSON === null) return res.json({ 
    success: false, 
    user: user.length,
    error: err 
  });
  return res.json({ 
    success: true, 
    amount: peopleJSON.length,
    users: peopleJSON 
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
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));