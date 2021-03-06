const express = require("express")
const app = express() // create an express app
const morgan = require("morgan") //
const checkAuth = require('./api/middlewares/checkAuth')


const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@article-api.oqplf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

mongoose.connection.on('connected',() => {
    console.log('MongoDB Connected!')
})
const articlesRoutes = require('./api/routes/articles')
const categoryRoutes = require('./api/routes/categories')
const usersRoutes = require('./api/routes/users')

app.use(morgan('dev'))
app.use('/uploads',express.static('uploads'))

app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origion", "*")
    res.header("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
        return res.status(200).json({})
    }
    next()
})

// Routes
app.use('/articles',articlesRoutes)
app.use('/categories',checkAuth ,categoryRoutes)
app.use('/users',usersRoutes)


app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

// Error management
app.use((error, req, res, next) => { 
    res.status(error.status)
    res.json({
        error: {
            message: error.message
        }
    })
    next(error)
})

module.exports = app;
