'use strict'
const SECRET = process.env.SECRET || "SECRET KEY";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const UserModel = (sequelize, DataTypes) => {
    const Users = sequelize.define('users', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.VIRTUAL,
            get() {
                return jwt.sign({ username: this.username }, SECRET);
            },
            set(tokenObj) {
                return jwt.sign(tokenObj, SECRET);
            }
        }
    })
    // ===================================
    Users.authenticateBasic = async function (username, password) {

        const user = await this.findOne({ where: { username: username } });
        const valid = await bcrypt.compare(password, user.password);
        if (valid) {
            return user;
        }
        throw new Error('Invalid USER NAME OR PASSWORD');
    }

    Users.authenticateToken = async function (token) {
        try {
            const parsedToken = jwt.verify(token, SECRET);
            const user = await this.findOne({ where: { username: parsedToken.username } });
            if (user) {
                return user;
            }
            throw new Error('invalid token')
        } catch (e) {
            throw new Error(e.message);
        }

    }
    return Users;
};

module.exports = UserModel


