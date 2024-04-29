require('dotenv').config();
const bcrypt = require('bcrypt');

class Password {

    async hash(password) {
        try {
            const hash = await bcrypt.hash(password, process.env.SALT_ROUNDS);
            return hash;
        } catch (err) {
            console.error(err.message);
            throw err;
        }
    }

    async compare(userPassword, hashedPassword) {
        try {
            const res = await bcrypt.compare(userPassword, hashedPassword);
            return res;
        } catch (err) {
            console.error(err.message);
            throw err;
        }
    }
}

module.exports = new Password()