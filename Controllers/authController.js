const Password = require('./password')
const config = require('../сonnect')
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthController {
    async register(req, res) {
        const {login, password, name, email, birthday} = req.body
        const hashedPassword = Password.hash(password)
        console.log(hashedPassword)
        try {
          const accessToken = jwt.sign({ login }, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: '1h' });
          const refreshToken = jwt.sign({ login }, process.env.REFRESH_TOKEN_PRIVATE_KEY);
          const query = "INSERT INTO user (login, password, name, email, birthday, refresh_token) VALUES (?, ?, ?, ?, ?, ?)";
          const values = [login, hashedPassword, name, email, birthday, refreshToken];
      
          const result = await new Promise((resolve, reject) => {
              config.query(query, values, (error, results) => {
                  if (error) {
                      reject(error);
                  } else {
                      resolve(results);
                  }
              });
          });

        res.json({ accessToken, refreshToken });
      
        }
        catch {
          console.error(error);
          res.status(500).send('Ошибка сервера');
        }
    }

    async login(req, res) {
        const {login, password} = req.body

        try {
          const results = await new Promise((resolve, reject) => {
              config.query('SELECT * FROM user WHERE login = ?', [login], (err, results) => {
                  if (err) {
                      reject(err);
                  } else {
                      resolve(results);
                  }
              });
          });
    
          if (results.length > 0) {
              const user = results[0];
              const passwordMatch = Password.compare(password, user.password);
              if (passwordMatch) {
                  const accessToken = jwt.sign({ login }, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: '30m' });
                  const refreshToken = jwt.sign({ login }, process.env.REFRESH_TOKEN_PRIVATE_KEY, { expiresIn: '30d' });
                  config.query('UPDATE user SET refresh_token = ? WHERE login = ?', [refreshToken, login])
                  res.json({ accessToken, refreshToken });
              } else {
                  res.status(401).send('Неверный пароль');
              }
          } else {
              res.status(401).send('Неверный логин');
          }
        } catch (error) {
            console.error(error);
            res.status(500).send('Ошибка сервера');
        }
    }

    logout(req, res) {

    }

    protected(req, res) {
      jwt.verify(req.token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, authData) => {
        if (err) {
          res.status(403).send({err, result: false});
        } else {
          res.json({ authData, result: true });
        }
      });
    }
}

module.exports = new AuthController()