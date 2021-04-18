const express = require("express");
const cors = require('cors');


const app = express();

app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: '111',
            name: 'final',
            email: 'final.csv@gmail.com',
            password: 'phone',
            entries: 0,
            joined: new Date()
        },
        {
            id: '222',
            name: 'first',
            email: 'first.csv@gmail.com',
            password: 'web',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: ''
        }
    ]
}

app.get('/', (req, res) => {
    
    res.send(database['users'])
})

app.post('/signin', (req, res)=> {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json(database.users[0]);
    } else {
        res.status(400).json('error')
    }
})

app.post('/register', (req, res) => {

    const {email, password, name} = req.body;
    
    database['users'].push({
        id: '123',
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    })
    res.status(200).json(database.users[database['users'].length-1])
})

app.get('/profile/:id', (req,res) => {
    const {id} = req.params;
    let user_found = false;

    database.users.forEach(user => {
        if (user.id === id){
            user_found = true;
            return res.json(user);
        }
    })
    if(!user_found) {
        res.status(400).json('no such user')
    }
});

app.put('/image', (req, res) => {

    const {id} = req.body;
    let user_found = false;

    database.users.forEach(user => {
        if (user.id === id){
            user_found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if(!user_found) {
        res.status(400).json('no such user');
    }

})


app.listen(5000, () => {
    console.log('app is listening on port 5000');
})

