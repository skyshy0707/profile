const {
    BAD_REQUEST
} = require('http-status-codes')

const db  = require("../../db.js")
const getUserIdbyJWT = require("../../utils/user.js")

const Comment = require("./model.js")(db.sequelize, db.Sequelize)
const Profile =  require("../profile/model.js")(db.sequelize, db.Sequelize)

exports.update = (request, response) => {
    const data = request.body
    const id = request.query.id

    Comment.update(data, {
        where: { id: id }
    }).then(results => {
            response.json(results)
    }).catch(error => {
        response.status(BAD_REQUEST).json({
            message: `Error updating comment with id: ${id}`,
            error: error
        })
    })
}

exports.create = async (request, response) => {
    const data = request.body
    const jwt = request.headers.authorization
    const { id } = getUserIdbyJWT(jwt)
    const profile = await Profile.findOne({ where: { userId: id }})

    const commentData = { 
        comment: data.comment,
        published: new Date().toISOString(),
        profileId: profile.id
    }

    Comment.create(commentData).then(results => {
        response.json(results)
    }).catch(error => {
        response.status(BAD_REQUEST).json({
            message: error.message || `Error occured with this data: ${commentData}`, 
            error: error.errors
        })
    })
}

exports.delete = (request, response) => {
    const id = request.query.id

    Comment.destroy({
        where: { id: id }
    }).then(results => {
        response.json({
             message: "Comment was deleted"
        })
    }).catch(error => {
        response.status(BAD_REQUEST).json({
            message: `Could not delete this comment with id: ${id}`,
            error: error,
        })
    })
}