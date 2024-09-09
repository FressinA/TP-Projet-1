const express = require("express");
const bodyParser = require('body-parser');
const sequelize = require('./database/db');
const User = require('./models/User');

const port = 3225;
const app = express();

async function authenticateDb()
{
    return sequelize.authenticate();
}

app.use(bodyParser.json());

authenticateDb()
    .then(()=>{
        console.log('Connecxion réussie !')
        User.sync();
    })
    .catch((error)=>{
        console.log(`Echec de la connexion: ${error}`)
    });

app.listen(port, ()=> {
    console.log(`Le serveur écoute sur le port ${port}`);
})