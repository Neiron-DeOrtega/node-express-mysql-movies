import express, { Request, Response } from "express";
import "reflect-metadata"
// const config = require('./сonnect.js')
const bodyParser = require('body-parser')
const cors = require('cors');
const authRouter = require('./src/Routes/authRouter')
require('dotenv').config();
import { getRepository } from "typeorm";
import { Movies } from "./src/Entities/Movies";
const dataSource = require('./ormconfig.json')

const app = express()
const port = 4000

app.use(cors());
app.options('*', cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(bodyParser.json())

// app.use('/movies', moviesRouter)
app.use('/auth', authRouter)

app.post('/api/getMovies', async (req: Request, res: Response) => {
    // const movieRepository = dataSource.getRepository(Movies);
    // const allMovies = await movieRepository.find();
    // res.send(allMovies);
    res.send('good')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
