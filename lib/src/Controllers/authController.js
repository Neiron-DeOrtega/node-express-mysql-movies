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
Object.defineProperty(exports, "__esModule", { value: true });
const PasswordCrypt = require('./passwordCrypt.ts');
const config = require('../../сonnect');
const jwt = require('jsonwebtoken');
require('dotenv').config();
class AuthController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, password, name, email, birthday } = req.body;
            const hashedPassword = PasswordCrypt.hash(password);
            console.log(hashedPassword);
            try {
                const accessToken = jwt.sign({ login }, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: '1h' });
                const refreshToken = jwt.sign({ login }, process.env.REFRESH_TOKEN_PRIVATE_KEY);
                const query = "INSERT INTO user (login, password, name, email, birthday, refresh_token) VALUES (?, ?, ?, ?, ?, ?)";
                const values = [login, hashedPassword, name, email, birthday, refreshToken];
                const result = yield new Promise((resolve, reject) => {
                    config.query(query, values, (error, results) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                res.json({ accessToken, refreshToken });
            }
            catch (err) {
                console.error(err);
                res.status(500).send('Ошибка сервера');
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, password } = req.body;
            try {
                const results = yield new Promise((resolve, reject) => {
                    config.query('SELECT * FROM user WHERE login = ?', [login], (err, results) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                if (results.length > 0) {
                    const user = results[0];
                    const passwordMatch = PasswordCrypt.compare(password, user.password);
                    if (passwordMatch) {
                        const accessToken = jwt.sign({ login }, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: '30m' });
                        const refreshToken = jwt.sign({ login }, process.env.REFRESH_TOKEN_PRIVATE_KEY, { expiresIn: '30d' });
                        config.query('UPDATE user SET refresh_token = ? WHERE login = ?', [refreshToken, login]);
                        res.json({ accessToken, refreshToken });
                    }
                    else {
                        res.status(401).send('Неверный пароль');
                    }
                }
                else {
                    res.status(401).send('Неверный логин');
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).send('Ошибка сервера');
            }
        });
    }
    logout(req, res) {
    }
    protected(req, res) {
        jwt.verify(req.token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, authData) => {
            if (err) {
                res.status(403).send({ err, result: false });
            }
            else {
                res.json({ authData, result: true });
            }
        });
    }
}
module.exports = new AuthController();
