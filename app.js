const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const rateLimit = require('express-rate-limit');
const app = express();

app.use(express.json());
app.use(cors());

// Initialisation de la connexion à la BDD
const db = mysql.createConnection({
    host: '192.168.64.155',
    user: 'apiUser',
    password: '481spotAPI',
    database: 'Lowrence'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connecté');
});

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { errorCode: 'ERR_TOO_MANY_REQUESTS', message: 'Trop de requêtes. Veuillez réessayer plus tard.' }
});
app.use(limiter);

// Codes d'erreur possibles
const customErrors = {
  'ERR_USER_NOT_FOUND': 'Utilisateur non trouvé',
  'ERR_INVALID_CREDENTIALS': 'Crédentiels de login invalides',
  'ERR_USER_EXISTS': 'Utilisateur déjà existant',
  'ERR_TOKEN_INVALID': 'Token invalide ou expiré'
};

// Clé secrète
const JWT_SECRET = 'bananasplit';

// Inscription
app.post('/register', (req, res) => {
    const { login, passwd } = req.body;
  
    // Validate login and password
    if (!login || !passwd) {
      return res.status(400).json({ error: 'Login et mots de passe requis' });
    }
  
    // Vérification de l'existence de l'utilisateur
    db.query('SELECT * FROM User WHERE login = ?', [login], (err, result) => {
      if (err) throw err;
  
      if (result.length > 0) {
        return res.status(400).json({ errorCode: 'ERR_USER_EXISTS', message: 'Utilisateur déjà existant' });
      }
  
      // Hash le password et insertion dans la bdd
      bcrypt.hash(passwd, 10, (err, hash) => {
        if (err) {
          console.error('Hash error:', err);
          return res.status(500).json({ error: 'Erreur lors du hashage du mot de passe' });
        }
  
        db.query('INSERT INTO User (login, passwd) VALUES (?, ?)', [login, hash], (err, result) => {
          if (err) {
            console.error('Erreur BDD:', err);
            return res.status(500).json({ error: 'Erreur lors de l\'insertion dans la base de données' });
          }
          res.json({ message: 'Utilisateur enregistré avec succès !' });
        });
      });
    });
  });
  

// Connexion
app.post('/login', (req, res) => {
    const { login, passwd } = req.body;
  
    db.query('SELECT * FROM User WHERE login = ?', [login], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur de serveur' });
      }
  
      if (result.length === 0) {
        return res.status(400).json({ errorCode: 'ERR_USER_NOT_FOUND', message: 'Utilisateur non trouvé' });
      }
  
      console.log(passwd);
      console.log(result[0].passwd);
      bcrypt.compare(passwd, result[0].passwd, (err, isMatch) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erreur de serveur' });
        }
  
        if (!isMatch) {
          return res.status(400).json({ errorCode: 'ERR_INVALID_CREDENTIALS', message: 'Mot de passe incorrect' });
        }
  
        const token = jwt.sign({ login: result[0].login }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token, message: 'Connexion réussie !' });
      });
    });
  });
  

// Middleware pour le token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ errorCode: 'ERR_TOKEN_INVALID', message: customErrors.ERR_TOKEN_INVALID });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ errorCode: 'ERR_TOKEN_INVALID', message: customErrors.ERR_TOKEN_INVALID });
    req.user = decoded;
    next();
  });
};

// Accueil
app.get('/home', verifyToken, (req, res) => {
  res.send(`Bienvenue, ${req.user.login}`);
});

// Déconnexion
app.post('/logout', (req, res) => {
  res.json({ message: 'Déconnexion réussie !' });
});

const port = 3225;

// Port serveur
app.listen(port, () => {
  console.log(`Serveur est en cours sur le port ${port}`);
});
