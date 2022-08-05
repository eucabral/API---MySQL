const mysql = require('../mysql').pool

exports.getProduct = (req,res,next) => {
    mysql.getConnection((error,conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM product',
            (error,result,fields) => {
                if(error) { return res.status(500).send({error: error})}
                const response = {
                    amount: result.length,
                    product: result.map(prod => {
                        return {
                            id_product: prod.id_product,
                            name: prod.name,
                            price: prod.price,
                            image_product: prod.image_product,
                            request: {
                                tipo: 'GET',
                                descrição: 'Retorna todos os produtos',
                                url: 'http://localhost:3000/product/' + prod.id_product
                            }
                        }
                    })
                }
                return res.status(200).send({response})
            }
        )
    })
}

exports.postProduct = (req,res,next) => {
    console.log(req.file)
    mysql.getConnection((error,conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            'INSERT INTO product(name,price) VALUES(?,?)',
            [req.body.name,req.body.price],
            (error,result,field) => {
                conn.release();
                if(error) {
                    return res.status(500).send({
                        error: error,
                    })
                }
                const response = {
                    message: 'Produto inserido com sucesso',
                    produtoCriado: {
                        id_product: result.id_product,
                        name: req.body.name,
                        price: req.body.price,
                        request: {
                            tipo: 'POST',
                            descrição: 'Insere um produto',
                            url: 'http://localhost:3000/product'
                        }
                    }
                }
                res.status(201).send({response})
            }
        )
    })

}

exports.idProduct =  (req,res,next) => {
    mysql.getConnection((error,conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM product WHERE id_product = ?',
            [req.params.id_product],
            (error,result,fields) => {
                if(error) { return res.status(500).send({error: error})}

                if(result.length == 0) {
                    return res.status(404).send({message: 'Produto nao encontrado'})
                }
                const response = {
                    product :{
                            id_product: result[0].id_product,
                            name: result[0].name,
                            price: result[0].price,
                            image_product: result[0].image_product,
                            request: {
                                tipo: 'GET',
                                descrição: 'retorna os detallhes de um produto especifico',
                                url: 'http://localhost:3000/product/'
                        }
                    }
                }
                res.status(201).send({response})
            }
        )
    })
}

exports.patchProduct = (req,res,next) => {
    mysql.getConnection((error,conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            `UPDATE product
            SET name         = ?,
                price        = ?
            WHERE id_product = ?`,
            [   req.body.name,
                req.body.price,
                req.body.id_product
            ],
            (error,result,field) => {
                conn.release();
                const response = {
                    message: 'Produto atualizado com sucesso',
                    produtoCriado: {
                        id_product: req.body.id_product,
                        name: req.body.name,
                        price: req.body.price,
                        request: {
                            tipo: 'PATCH',
                            descrição: 'Atualiza um produto',
                            url: 'http://localhost:3000/product' + req.body.id_product
                        }
                    }
                }
                res.status(201).send({response})
            }
        )
    })
}

exports.deleteProduct = (req,res,next) => {
    mysql.getConnection((error,conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            `DELETE FROM product WHERE id_product = ?`,[req.body.id_product],
            (error,result,fields) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}
                const response = {
                    message: 'produto removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descrição: 'remove um produto',
                        url: 'http://localhost:3000/product',
                        body: {
                            name: 'String',
                            price: 'Number'
                        }
                    }
                }
            res.status(202).send({response})
            }
        )
    })
}