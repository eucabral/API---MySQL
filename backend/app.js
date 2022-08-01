const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParse = require('body-parser')

const routesProduct = require('./routes/product')
const routesRequest = require('./routes/request')
const routesUser = require('./routes/user')

app.use(morgan('dev'))
app.use('./uploads',express.static('static'))
app.use(bodyParse.urlencoded({ extended: false })) ///apenas dados simples
app.use(bodyParse.json())///apenas json

app.use((req,res,next) => {
    res.header('Acess-Control-Allow-Origin', '*')
    res.header('Acess-Control-Allow-Header,Origin,X-Request-With,Content-Type,Accept,Autorization')
    if(req.method === 'OPTIONS') {
        res.header('Acess-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET')
    }
    next()
})

app.use('/product',routesProduct)
app.use('/request',routesRequest)
app.use('/users',routesUser)

///quando nao encontra rota
app.use((req,res,next) => {
    const erro = new Error('Nao encontrado')
    erro.status = 404
    next(erro)
})

app.use((error,req,res,next) => {
    res.status(error.status || 500)
    return res.send({erro: {message: error.message}})
})

module.exports = app