const config = require('./сonnect')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const mysql2 = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express()
const port = 4000

app.use(cors());
app.options('*', cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(bodyParser.json())

app.get('/', function(req, res){
  res.send("Hello from the root application URL");
});

const saltRounds = 10

const passwordHash = async (password) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err) {
      console.error(err.message);
      throw err;
  }
}

const passwordCompare = async (userPassword, hashedPassword) => {
  try {
    const res = await bcrypt.compare(userPassword, hashedPassword);
    return res;
  } catch (err) {
      console.error(err.message);
      throw err;
  }
}

app.post('/api/getMovies', (req, res) => {
    let movieName = req.body.movieName + '%'

    let query = `SELECT 
      movies.movies_id,
      movies.movie_name,
      movies.release_date,
      movies.movie_logo,
      movies.description,
      GROUP_CONCAT(DISTINCT director.director_name) AS directors,
      GROUP_CONCAT(DISTINCT actors.actor_name) AS actors,
      GROUP_CONCAT(DISTINCT genres.genre_name) AS genres
  FROM
      movies
          LEFT JOIN
      director_link ON movies.movies_id = director_link.movies_id
          LEFT JOIN
      director ON director_link.director_id = director.director_id
          LEFT JOIN
      actors_link ON movies.movies_id = actors_link.movies_id
          LEFT JOIN
      actors ON actors_link.actors_id = actors.actors_id
          LEFT JOIN
      genres_link ON movies.movies_id = genres_link.movies_id
          LEFT JOIN
      genres ON genres_link.genres_id = genres.genres_id
  WHERE
      movies.movie_name LIKE ?
  GROUP BY
      movies.movies_id;
  `;


    config.query(query, [movieName], (error, data) => {
      if (error) {
        console.log(error)
      }
        res.send(data)
    })
})


app.post('/api/login', async (req, res) => {
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
          const passwordMatch = await passwordCompare(password, user.password);
          if (passwordMatch) {
              const accessToken = jwt.sign({ login }, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: '30m' });
              const refreshToken = jwt.sign({ login }, process.env.REFRESH_TOKEN_PRIVATE_KEY, { expiresIn: '30d' });
              config.query('UPDATE user SET refresh_token = ? WHERE login = ?', [refreshToken, login])
              res.json({ accessToken, refreshToken });
              console.log("Успешная авторизация!")
          } else {
              res.status(401).send('Неверный логин или пароль1');
          }
      } else {
          res.status(401).send('Неверный логин или пароль2');
      }
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка сервера');
    }
})

app.post('/api/register', async (req, res) => {
  const {login, password, name, email, birthday} = req.body
  const hashedPassword = await passwordHash(password)
  console.log(hashedPassword)
  try {
    const accessToken = jwt.sign({ login }, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: '30m' });
    const refreshToken = jwt.sign({ login }, process.env.REFRESH_TOKEN_PRIVATE_KEY, { expiresIn: '30d' });
    const query = "INSERT INTO user (login, password, name, email, birthday, refresh_token) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [login, hashedPassword, name, email, birthday, refreshToken];

    config.query(query, values, (error, results) => {
      if (error) {
        res.status(401).send("Ошибка регистрации");
      } else {
        res.json({ accessToken, refreshToken });
      }
    });

  }
  catch {
    console.error(error);
    res.status(500).send('Ошибка сервера');
  }
})

// Роут для проверки JWT и получения защищенных данных
app.get('/api/protected', verifyToken, (req, res) => {
  jwt.verify(req.accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, authData) => {
    if (err) {
      console.log(authData)
      res.sendStatus(403);
    } else {
      console.log(authData)
      res.json({ message: 'Protected data accessed', authData });
    }
  });
});

// Функция для проверки JWT в заголовке Authorization
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
