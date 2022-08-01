const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool

//retorna todos os pedidos
router.get('/',(req,res,next) => {
    mysql.getConnection((error,conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            `SELECT request.id_request,
			        request.amount,
                    product.id_product,
                    product.name,
                    product.price
                FROM request
            INNER JOIN product
                ON product.id_product = request.id_request`,
            (error,result,fields) => {
                if(error) { return res.status(500).send({error: error})}
                const response = {
                    request: result.map(request => {
                        return {
                            id_request: request.id_request,
                            mount: request.amount,
                            produto: {
                                id_product: request.id_product,
                                name: request.name,
                                price: request.price,
                            },
                            request: {
                                tipo: 'GET',
                                descrição: 'Retorna um pedido',
                                url: 'http://localhost:3000/request/' + request.id_product
                            }
                        }
                    })
                }
                return res.status(200).send({response})
            }
        )
    })
})

//insere um pedidos
router.post('/',(req,res,next) => {

    mysql.getConnection((error,conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query('SELECT * FROM product WHERE id_product = ?', 
        [req.body.id_product], 
        (error,result,field) => {
            if(error) {return res.status(500).send({error: error,}) }
            if(result.length == 0) {
                return res.status(404).send({message: 'Produto nao encontrado'})
            }
            mysql.getConnection((error,conn) => {
                if(error) { return res.status(500).send({error: error})}
                conn.query(
                    'INSERT INTO request(id_product,amount) VALUES(?,?)',
                    [req.body.id_product,req.body.amount],
                    (error,result,field) => {
                        conn.release();
                        if(error) {
                            return res.status(500).send({error: error,})
                        }
                        const response = {
                            message: 'Pedido inserido com sucesso',
                            pedidoCriado: {
                                id_request: result.id_request,
                                id_product: result.id_product,
                                amount: req.body.amount,
                                request: {
                                    tipo: 'GET',
                                    descrição: 'Retorna todos os pedidos',
                                    url: 'http://localhost:3000/request'
                                }
                            }
                        }
                        res.status(201).send({response})
                    }
                )
            })
        })
    })
})

///retorna um pedido especifico
router.get('/:id_request',(req,res,next) => {
    mysql.getConnection((error,conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM request WHERE id_request = ?',
            [req.params.id_request],
            (error,result,fields) => {
                if(error) { return res.status(500).send({error: error})}

                if(result.length == 0) {
                    return res.status(404).send({message: 'Pedido nao encontrado'})
                }
                const response = {
                    request: {
                        id_request: result[0].id_request,
                        id_product: result[0].id_product,
                        name: result[0].name,
                        request: {
                            tipo: 'GET',
                            descrição: 'Retorna todos os pedidos',
                            url: 'http://localhost:3000/request'
                        }
                    }
                }
                res.status(201).send({response})
            }
        )
    })
})

///deleta o pedido
router.delete('/',(req,res,next) => {
    mysql.getConnection((error,conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            `DELETE FROM request WHERE id_request = ?`,[req.body.id_request],
            (error,result,fields) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}
                const response = {
                    message: 'Pedido removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descrição: 'remove um produto',
                        url: 'http://localhost:3000/request',
                        body: {
                            id_product: 'Number',
                            amount: 'Number'
                        }
                    }
                }
            res.status(202).send({response})
            }
        )
    })
})



module.exports = router