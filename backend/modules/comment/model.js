const db = require("../../db.js");
const Profile = require("../profile/model.js")(db.sequelize, db.Sequelize)

module.exports = () => {
    const Comment = db.sequelize.define("comment", {
        comment: {
            type: db.Sequelize.TEXT,
            allowNull: false,
            validate: {
                notnullValidator(value){
                    if (value === null || value === ''){
                        throw new Error("Comment field can't be empty")
                    }
                }
            }
        },
        published: {
            type: db.Sequelize.DATE
        }
    })

    Profile.hasMany(Comment)
    Comment.belongsTo(Profile)
    return Comment
}