const express = require("express");
const cors = require('cors');
const knex = require('knex');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const register = require('./controllers/register');
const signin = require('./controllers/signIn');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'password',
      database : 'image_recog'
    }
  });

const app = express();

app.use(express.json());

app.use(cors());

app.post('/signin', (req, res)=> {signin.handleSignin(req, res, db, bcrypt)});

app.post('/register', (req, res) => {
    register.handleRegister(req, res, db, bcrypt)});

app.get('/profile/:id', (req,res) => {profile.handleProfileGet(req, res, db)});

app.put('/image', (req, res) => {image.handleImage(req, res, db)});

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`);
});

console.log(process.env)