require('dotenv').config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {
    BAD_REQUEST,
} = require('http-status-codes')

const db = require("../../db.js")
const Profile =  require("../profile/model.js")(db.sequelize, db.Sequelize)
const User = require("./model.js")(db.sequelize, db.Sequelize)

const { JWT_SECRET } = process.env

exports.login = async (request, response) => {
    const { email, password } = request.body
    const user = await User.findOne({ where: { email: email }})

    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            const payLoad = { id: user.id }
            const token = jwt.sign(payLoad, JWT_SECRET, { algorithm: 'HS256' })
            return response.json({ JWT_TOKEN: token, username: user.username })
        } 
        return response.status(BAD_REQUEST).json({ message: 'Wrong password' })
    } 
    return response.status(BAD_REQUEST).json({ message: 'Wrong email' })  
}

exports.create = async (request, response) => {
    const data = request.body
    const salt = await bcrypt.genSalt()
    data.password = await bcrypt.hash(data.password, salt)
    data.create_date = new Date().toISOString()

    User.create(data).then(results => {
        Profile.create({ userId: results.id }).then(results => {
            console.log("User profile was created", results)
        })
        response.json(results)

    }).catch(error => {
        response.status(BAD_REQUEST).json({
            message: error.message || `Error occured with this data: ${commentData}`
        })
    })
}
