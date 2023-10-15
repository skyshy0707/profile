const db = require("../../db.js");

module.exports = () => {
    const User = db.sequelize.define("user", {

        username: {
            type: db.Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: db.Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                is: /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm
            }
        },
        password: {
            type: db.Sequelize.STRING,
            allowNull: false,
            validate: {
                is: /[\w!@#\$%\^\&*\)\(+=._-]{8,}$/
            }
        },
        phone: {
            type: db.Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                is: /(^[\+\(])([\d\s\)\-])+$/g
            }
        },
        create_date: {
            type: db.Sequelize.DATE,
        },
    },)
    return User
}