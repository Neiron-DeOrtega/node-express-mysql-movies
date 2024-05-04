const PasswordCrypt = require('./passwordCrypt.ts')
const config = require('../../сonnect')
const jwt = require('jsonwebtoken');
import { Request, Response } from "express";
require('dotenv').config();

interface UserData {
    user_id: number,
    login: string,
    password: string,
    name: string,
    email: string,
    birthday: string,
    role: number,
    refresh_token: string
}

class AuthController {
    async register(req: Request, res: Response) {
        const {login, password, name, email, birthday} = req.body
        const hashedPassword = PasswordCrypt.hash(password)
        console.log(hashedPassword)
        try {
          const accessToken = jwt.sign({ login }, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: '1h' });
          const refreshToken = jwt.sign({ login }, process.env.REFRESH_TOKEN_PRIVATE_KEY);
          const query = "INSERT INTO user (login, password, name, email, birthday, refresh_token) VALUES (?, ?, ?, ?, ?, ?)";
          const values = [login, hashedPassword, name, email, birthday, refreshToken];
      
          const result = await new Promise((resolve, reject) => {
              config.query(query, values, (error: any, results: UserData[]) => {
                  if (error) {
                      reject(error);
                  } else {
                      resolve(results);
                  }
              });
          });

        res.json({ accessToken, refreshToken });
      
        }
        catch(err) {
          console.error(err);
          res.status(500).send('Ошибка сервера');
        }
    }

    async login(req: Request, res: Response) {
        const {login, password} = req.body

        try {
          const results: UserData[] = await new Promise((resolve, reject) => {
              config.query('SELECT * FROM user WHERE login = ?', [login], (err: any, results: UserData[]) => {
                  if (err) {
                      reject(err);
                  } else {
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

    logout(req: Request, res: Response) {

    }

    protected(req: Request | any, res: Response) {
      jwt.verify(req.token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err: any, authData: any) => {
        if (err) {
          res.status(403).send({err, result: false});
        } else {
          res.json({ authData, result: true });
        }
      });
    }
}

module.exports = new AuthController()