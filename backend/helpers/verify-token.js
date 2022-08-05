const jwt = require('jsonwebtoken')

exports.obrigatorio = (req,res,next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token,process.env.JWT_KEY)
        req.users = decode
        next()
    } catch (error) {
        return res.status(401).send({message: 'falha na autenticaçao'})
    }
}

exports.opcional = (req,res,next) => {
    try {
        const token = req.headers.authorization.split(' ')[0]
        const decode = jwt.verify(token,'segredo')
        req.users = decode
        next()
    } catch (error) {
        next()
    }
}