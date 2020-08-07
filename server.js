const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const { User } = require('./models')
const SECRET = 'Hayden'
app.use(express.json())
app.get('/api/users', async(req,res) => {
    const users = await User.find()
    res.send(users)
})
app.post('/api/register', async (req,res) => {
    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    })
    //console.log(req.body)
    res.send(user)
})

app.post('/api/login', async (req,res) => {
    //check user isavailable?
    const user = await User.findOne({
        username: req.body.username
    })
    if (!user) {
        //数据不存在 Unprocessable Entity
        return res.status(422).send({
            message: 'Username does not exist'
        })
    }
    const isPasswordVaild = require('bcrypt').compareSync(
        req.body.password,
        user.password
        )
    if(!isPasswordVaild){
        return res.status(422).send({
            message: 'Password is unvaild'
        })
    }
    //token
    const token = jwt.sign({
        id: String(user._id),
    }, SECRET)
    res.send({
        user,
        token: token
    })
})

//中间件
const auth = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop()
    const {id} = jwt.verify(raw, SECRET)
    req.user = await User.findById(id)
    next()
}

app.get('/api/profile', auth, async (req,res) => {
    res.send(req.user)
})

// app.get('api/orders', auth, async (req,res) => {
//     const orders = await Order.find().where({
//         user: req.user._id
//     })
//     res.send(orders)
// })

app.listen(4000,() => {
    console.log('http://localhost:4000')
})