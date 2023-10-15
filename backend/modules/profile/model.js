const db = require("../../db.js");
const User = require("../user/model.js")(db.sequelize, db.Sequelize)

const DAY_COUNTER_MAX = 92
const MS_PER_HOUR = 86400000

module.exports = () => {
    const Profile = db.sequelize.define("profile", {
        day_counter: {
            type: db.Sequelize.INTEGER(2),
            defaultValue: 0,
            validate: {
                min: 0,
                max: 92
            },
        },
        amount: {
            type: db.Sequelize.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
                is: /^\d+$/
            }
        },
        account_calendar_days: {
            type: db.Sequelize.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
                is: /^\d+$/
            }
        },

        reference_registration_date: {
            type: db.Sequelize.VIRTUAL,
            get() {
                return this.getDataValue('reference_registration_date')
            },
            set(user_create_date){
                const referenceDate = new Date(user_create_date)
                referenceDate.setDate(referenceDate.getDate() + 1)
                referenceDate.setHours(0, 0, 0, 0)
                this.setDataValue('reference_registration_date', referenceDate)
            }
        },

        account_calendar_days_auth: {
            type: db.Sequelize.VIRTUAL,
            defaultValue: 0,
            get() {
                var referenceRegistrationDate = this.reference_registration_date
                return Math.floor((new Date() - referenceRegistrationDate) / MS_PER_HOUR) + 1

            },
            set(value){
                throw new Error("Действие запрещено")
            }
        },
        day_counter_auth: {
            type: db.Sequelize.VIRTUAL,
            get() {
                var accountCalendarDaysAuth = this.account_calendar_days_auth
                var accountCalendarDaysLastAuth = this.account_calendar_days
                var passedDaysBetweenAuth = accountCalendarDaysAuth - accountCalendarDaysLastAuth
                var dayCounter = this.day_counter
                var dayCounterUpdate = dayCounter + passedDaysBetweenAuth

                dayCounterUpdate = dayCounterUpdate > DAY_COUNTER_MAX ? DAY_COUNTER_MAX : dayCounterUpdate
                return dayCounterUpdate
            },
            set(value){
                throw new Error("Action is prohibited")
            }
        }
    })
    User.hasOne(Profile)
    Profile.belongsTo(User)
    return Profile
}