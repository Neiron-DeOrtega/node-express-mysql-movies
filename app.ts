import express, { Request, Response } from "express";
import "reflect-metadata"
const configConnect = require('./сonnect')
const bodyParser = require('body-parser')
const cors = require('cors');
const authRouter = require('./src/Routes/authRouter')
require('dotenv').config();

const app = express()
const port = 4000

app.use(cors());
app.options('*', cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(bodyParser.json())

// app.use('/movies', moviesRouter)
app.use('/auth', authRouter)

app.post('/api/getMovies', (req: Request, res: Response) => {
    let movieName;
    if (req.body && 'movieName' in req.body) {
        movieName = req.body.movieName + '%';
    } else {
        console.error('Ошибка: req.body или свойство movieName отсутствуют');
    }

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


    configConnect.query(query, [movieName], (error: any, data: any) => {
      if (error) {
        console.log(error)
      }
      res.send(data)
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
