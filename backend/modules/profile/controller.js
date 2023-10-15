const {
    BAD_REQUEST,
    UNAUTHORIZED,
    INTERNAL_SERVER_ERROR
} = require('http-status-codes')

const db = require("../../db.js")
const getUserIdbyJWT = require("../../utils/user.js")

const Comment = require("../comment/model.js")(db.sequelize, db.Sequelize)
const Profile = require("./model.js")(db.sequelize, db.Sequelize)
const User = require("../user/model.js")(db.sequelize, db.Sequelize)

const { DAY_COUNTER_MAX } = require("../helpers/constants.js")

exports.create = async (request, response) => {
    const data = request.body
    const jwt = request.headers.authorization
    const { id } = getUserIdbyJWT(jwt)
    
    const user = await User.findOne({ where: { id: id } })
    data.userId = user.id

    Profile.create(data).then(results => {
        response.json(results)
    }).catch(error => {
        response.status(BAD_REQUEST).json({
            message: error.message || `Error occured with this data: ${commentData}`
        })
    })
}

exports.update = async (request, response) => {

    const data = request.body
    const jwt = request.headers.authorization
    const { id } = getUserIdbyJWT(jwt)
    const reset = request.query.reset
    const user = await User.findOne({ where: { id: id } })

    if (!user){
        response.status(UNAUTHORIZED).json({
            message: "Unauthorized request"
        })
    }
    const profile = await Profile.findOne({ where: {userId: user.id} })

    if (profile.day_counter == DAY_COUNTER_MAX){
        data.day_counter = DAY_COUNTER_MAX
    }

    if(reset){
        data.amount = 0
        data.day_counter = 0
    }
    Profile.update(data, { 
        where: { userId: user.id }
    }).then(results => {
        response.json(results)
    }).catch(error => {
        response.status(BAD_REQUEST).json({
            message: `Error updating with user id: ${user.id}, data: ${data}`,
            error: error.errors
        })
    })
}

exports.retrieveProfileData = async (request, response) => {
    const jwt = request.headers.authorization
    const { id } = getUserIdbyJWT(jwt)
    const user = await User.findOne({ where: { id: id } })

    if (!user){
        return response.status(UNAUTHORIZED).json({
            message: "Unauthorized request"
        })
    }
    const profile = await Profile.findOne({ where: { userId: user.id } })
    const comments = await Comment.findAll({ 
        where: { profileId: profile.id },
        order: [ ['published', 'DESC'] ]
    })

    profile.set('reference_registration_date', user.create_date)
    var accountCalendarDaysAuth = profile.account_calendar_days_auth
    var dayCounterAuth = profile.day_counter_auth

    const updProfileData = { 
        day_counter: dayCounterAuth,
        account_calendar_days: accountCalendarDaysAuth
    }

    await Profile.update(updProfileData, { where: { userId: user.id } })
        .then(results => { 
            console.log(`Updated profile ${results}`) 
            return response.json({
                day_counter: dayCounterAuth,
                amount: profile.amount,
                comments: comments,
                create_date: user.create_date,
            })
        })
        .catch(error => {
            response.status(INTERNAL_SERVER_ERROR).json({
                message: `Error retrieve profile when updating with user id: ${user.id}`,
                error: error })
        }) 
}