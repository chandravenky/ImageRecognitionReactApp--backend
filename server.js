const express = require("express");
const cors = require('cors');
const knex = require('knex');
const { response } = require("express");
const bcrypt = require('bcrypt-nodejs');



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

app.post('/signin', (req, res)=> {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid){
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json("unable to get json"))
        } else {
        res.status(400).json('incorrect credentials')
        }
    })
    .catch(err => res.status(400).json("incorrect credentials"))
})

app.post('/register', (req, res) => {

    const {email, password, name} = req.body;
    const hash = bcrypt.hashSync(password);
    
    db.transaction(trx => {
trx.insert({
    hash: hash,
    email: email
    })
    .into('login')
    .returning('email')
    .then(loginemail => {
        return trx('users')
        .returning('*')
        .insert({
            email: loginemail[0],
            name: name,
            joined: new Date()
        })
        .then(response => {
            res.json(response[0])
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
    })
    .catch(err => res.json("unable to register"))
})

app.get('/profile/:id', (req,res) => {
    const {id} = req.params;

    db.select('*').from('users').where({
        'id': id}).then(user => {
        if(user.length) {
            res.json(user[0])
        } else {
        res.status(400).json("Not found")
        }
    })
    .catch(err => res.status(400).json("error getting user"))
});

app.put('/image', (req, res) => {

    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then (entries => {
        res.json(entries[0])
    })
    .catch(err => {res.status(400).json("unable to get entries")})

})


app.listen(5000, () => {
    console.log('app is listening on port 5000');
})

