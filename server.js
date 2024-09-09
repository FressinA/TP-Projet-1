const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const mysql = require('mysql');
const { RateLimiterMemory } = require('rate-limiter-flexible');
app.use(cors());
app.use(express.json());


const connection = mysql.createConnection({
   host: '192.168.64.155', // L'hôte de la base de données
   user: 'apiUser', // Votre nom d'utilisateur MySQL
   password: '481spotAPI', // Votre mot de passe MySQL
   database: 'td3' // Le nom de votre base de données
});


// Connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    throw err;
  }
  console.log('Connecté à la base de données MySQL');
  });

const rateLimiter = new RateLimiterMemory({
  points: 1,
  duration: 10,
});

// Middleware pour limiter les requêtes
const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send('Too Many Requests');
    });
};
      
app.use(rateLimiterMiddleware);
app.use(cors());
      
// Configuration d'une route pour la racine "/"
app.post('/', (req, res) => {
  let temp =  Math.floor(Math.random() * (36 - (-10) + 1)) + (-10);
  const response = {
      temperature: temp,
      unit: '°C'
  };
  
  res.json(response);
  });
  
  // Écoute du serveur sur le port spécifié
app.listen(port, () => {
  console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
});

app.get('/', (req, res) => {
  //const donneesDuCorps = req.body.login;
  //console.log(donneesDuCorps);
  //res.send('Données reçues et traitées !');
  
  connection.query('SELECT * FROM User', (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).send('Erreur lors de la requête SQL');
      return;
    }
  
    // Envoi des résultats en tant que réponse JSON
    res.json(results);
  });
  
});
app.post('/addUser', (req, res) => {

 const { login, mdp } = req.body;
          
  if (!login || !mdp) {
    return res.status(400).json({ message: 'login et mdp requis' });       
  }
          
  // Requête d'insertion
  const sql = 'INSERT INTO User (login, mdp) VALUES (?, ?)';
          
  // Exécute la requête
  connection.query(sql, [login, mdp], (err, results) => {
    if (err) {
        console.error('Erreur lors de l\'exécution de la requête d\'insertion :', err);
        res.status(500).send('Erreur lors de l\'insertion des données');
        return;
    }
          
    //je rajoute au json une cles success à true que j'utilise dans le front
    //cette clé me permetra de vérifier que l'api s'est bien déroulé
    req.body.success = true;
    res.json(req.body);
  });
          
          
});

       
