"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
// const config = require('./сonnect.js')
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./src/Routes/authRouter');
require('dotenv').config();
const typeorm_1 = require("typeorm");
const Movies_1 = require("./src/Entities/Movies");
const app = (0, express_1.default)();
const port = 4000;
app.use(cors());
app.options('*', cors());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(bodyParser.json());
// app.use('/movies', moviesRouter)
app.use('/auth', authRouter);
app.post('/api/getMovies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movieRepository = (0, typeorm_1.getRepository)(Movies_1.Movies);
    const allMovies = yield movieRepository.find();
    res.send(allMovies);
}));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
