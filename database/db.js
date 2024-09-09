const Sequelize = require("sequelize")

const sequelize = new Sequelize('Lowrence', 'apiUser', '481spotAPI', {
    dialect: 'mariadb',
    port: 3225,
    host: '192.168.64.155'
});

module.exports = sequelize;