require('dotenv').config();
const bcrypt = require('bcrypt');

class Password {

    async hash(password: string) {
        try {
            const hash = await bcrypt.hash(password, process.env.SALT_ROUNDS);
            return hash;
        } catch (err: any) {
            console.error(err.message);
            throw err;
        }
    }

    async compare(userPassword: String, hashedPassword: String) {
        try {
            const res = await bcrypt.compare(userPassword, hashedPassword);
            return res;
        } catch (err: any) {
            console.error(err.message);
            throw err;
        }
    }
}

module.exports = new Password()