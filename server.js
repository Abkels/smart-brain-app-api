const express = require('express');
const bodyParser = require('body-parser'); // latest version of exressJS now comes with Body-Parser!
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  // connect to your own database here:
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'aneagoie',
    password : '',
    database : 'smart-brain'
  }
});

const app = express();
const port = 3001;

app.use(cors())
app.use(express.json()); // latest version of exressJS now comes with Body-Parser!

app.get('/', (req, res)=> { res.send(db.users) })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

const server = app.listen(port, ()=> {
  console.log('app is running on port 3000');
});

//Handle unhandled promise rejections
process.on('unhandledRejection',(err, promise)=> {
    console.log(`Error: ${err.message}`);
    // close server and exit process
    server.close(()=> process.exit(1));
})

// uncaught exception handler
process.on('uncaughtException',(err, promise)=>{
    console.log(`Error: ${err.message}`);
    // close server and exit process
    server.close(()=> process.exit(1));
})