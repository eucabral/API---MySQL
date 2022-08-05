const mysql = require('../mysql').pool
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = (req,res,next) => {
    mysql.getConnection((err,conn) => {
        if(err) {return res.status(500).send({error : error})}
        conn.query('SELECT * FROM users WHERE email = ?',[req.body.email],(error,results) => {
            if(err) {return res.status(500).send({error : error})}
            if(results.lenght > 0){
                res.status(401).send({message: 'Usuario ja cadastrado'})
            }
        })
        bcrypt.hash(req.body.password,10,(errBcrypt,hash) => {
            if(errBcrypt) {return res.status(500).send({error: errBcrypt})}
            conn.query(
                `INSERT INTO users (email,password) VALUES (?,?)`,
                [req.body.email,hash],
                (error,results) => {
                    if(err) {return res.status(500).send({error : error})}
                    response = {
                        message: "usuario cadastrado",
                        usuarioCriado: {
                            id_users: results.insertId,
                            email: req.body.email
                        }
                    }
                    return res.status(201).send({response})
                })
            })
        })
    }

exports.login = (req,res,next) => {
    mysql.getConnection((error,conn) => {
        if(error) { return res.status(500).send({error: error})}
        const query = `SELECT * FROM users WHERE email = ?`
        conn.query(query,[req.body.email],(error,results,fields) => {
            conn.release()
            if(error) {return res.status(500).send({error: error})}
            if(results.lenght < 1) {
                return res.status(401).send({message: 'falha na autenticação'})
            }
            bcrypt.compare(req.body.password, results[0].password,(err,result) => {
                if(err) {
                    return res.status(401).send({message: 'falha na autenticaçao'})
                }
                if(result) {
                    const token = jwt.sign({
                        id_users: results[0].id_users,
                        email: results[0].email
                    }, process.env.JWT_KEY,{
                        expiresIn: "1h"
                    })
                    return res.status(200).send({message: 'Autenticado com sucesso',token: token})
                }
                return res.status(401).send({message: 'falha na autenticaçao'})
            })
        })
    })
}