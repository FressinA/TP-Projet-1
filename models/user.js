const sequelize = require("../database/db");
const { DataTypes } = require("sequelize");

const User = sequelize.define('user', {
    id: {
        field: 'userid',
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    login: {
        field: 'login',
        type: DataTypes.STRING,
        allowNull: false
    },
    passwd: {
        field: 'passwd',
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = User;