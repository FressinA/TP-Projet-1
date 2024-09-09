const express = require('express');
const app = express();
const cors = require('cors');
const port = 3225;
const mysql = require('mysql');
const sha1 = require('sha1');
const { RateLimiterMemory } = require('rate-limiter-flexible');
app.use(cors());
app.use(express.json());

var hashedPassword;

const connection = mysql.createConnection({
   host: '192.168.64.155', // L'hôte de la base de données
   user: 'apiUser', // Votre nom d'utilisateur MySQL
   password: '481spotAPI', // Votre mot de passe MySQL
   database: 'Lowrence' // Le nom de votre base de données
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
      res.status(429).send('Trop de requêtes !');
    });
};
      
app.use(rateLimiterMiddleware);
app.use(cors());
  
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

app.post('/register', (req, res) => {

 const { login, passwd } = req.body;
          
  if (!login || !passwd) {
    return res.status(400).json({ message: 'Le login et mot de passe sont tous deux requis' });       
  }

  const hashed = sha1(passwd);
  const sqlVerify = `SELECT * FROM User WHERE login = ${login} AND passwd = ${passwd}`;
   // Exécute la requête
   connection.query(sqlVerify, [login, hashed], (err, results) => {
    if (err) {
        console.error('Erreur lors de l\'exécution de la requête d\'insertion :', err);
        res.status(500).send('Erreur lors de la vérification des données');
        return;
    }
  });
          
  // Requête d'insertion
  const sql = 'INSERT INTO User (login, passwd) VALUES (?, ?)';
          
  // Exécute la requête
  connection.query(sql, [login, hashed], (err, results) => {
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

app.post('/login', (req, res) => {

  const { login, passwd } = req.body;
           
   if (!login || !passwd) {
     return res.status(400).json({ message: 'Le login et mot de passe sont tous deux requis' });       
   }
 
   const hashed = sha1(passwd);
   const sql = `SELECT * FROM User WHERE login = ${login} AND passwd = ${passwd}`;
           
   // Exécute la requête
   connection.query(sql, [login, hashed], (err, results) => {
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

       
