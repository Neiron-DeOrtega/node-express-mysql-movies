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
require('dotenv').config();
const bcrypt = require('bcrypt');
class Password {
    hash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hash = yield bcrypt.hash(password, process.env.SALT_ROUNDS);
                return hash;
            }
            catch (err) {
                console.error(err.message);
                throw err;
            }
        });
    }
    compare(userPassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield bcrypt.compare(userPassword, hashedPassword);
                return res;
            }
            catch (err) {
                console.error(err.message);
                throw err;
            }
        });
    }
}
module.exports = new Password();
