//import { connect } from './node_modules/mongoose'
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/react-backend', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}) 

const UserSchema = new mongoose.Schema({
    username: {type:String, unique: true},
    password: {type:String, 
               set(val){
                   //散列加密,同步加密,bcrypt包,10级
                return require('bcrypt').hashSync(val, 10)
                }
            },
})
const User = mongoose.model('User', UserSchema)
//User.db.dropCollection('users')
module.exports = { User }