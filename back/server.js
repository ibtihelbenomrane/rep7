const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Remplace par ton utilisateur MySQL
  password: '', // Remplace par ton mot de passe MySQL
  database: 'registerdb', // Le nom de ta base de données
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    throw err;
  }
  console.log('Connecté à MySQL');
});

// Route d'inscription
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, phone, cin, password } = req.body;

  // Vérification si l'utilisateur existe déjà
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      return res.status(400).send('L\'utilisateur existe déjà.');
    } else {
      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertion de l'utilisateur dans la base de données
      db.query(
        'INSERT INTO users (first_name, last_name, email, phone, cin, password) VALUES (?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, phone, cin, hashedPassword],
        (err, result) => {
          if (err) throw err;
          res.status(201).send('Utilisateur enregistré avec succès.');
        }
      );
    }
  });
});

// Lancer le serveur
app.listen(5000, () => {
  console.log('Serveur en cours d\'exécution sur le port 5000');
});
 