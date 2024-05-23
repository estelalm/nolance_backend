/***********************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados no Banco SQL;
 *              aqui realizamos o CRUD na linguagem SQL.
 * Data: 21/05/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/


const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

const selectAllCategorias = async function() {

    try{
        let sql = `select * from tbl_categoria`

        let rsCategorias = await prisma.$queryRawUnsafe(sql)

        return rsCategorias

    }catch(error){
        console.log(error)
        return false
    }
}

const selectCategoriaById = async function(id) {

    let idCategoria = id

    try{
        let sql = `select * from tbl_categoria where id = ${idCategoria}`

        let rsCategoria = await prisma.$queryRawUnsafe(sql)

        return rsCategoria
    }catch(error){
        return false
    }
}

const insertCategoria = async function(dados) {

    let dadosCategoria = dados

    try{
        let sql = `insert into tbl_categoria(nome, icone) values 
                    ('${dadosCategoria.nome}', '${dadosCategoria.icone}');`

        let rsCategoria = await prisma.$executeRawUnsafe(sql)

        return rsCategoria
    }catch(error){
        console.log(error)
        return false
    }
}

const updateCategoria = async function(dadosSubCategoria, idCategoria) {

    let dados = dadosSubCategoria
    let id = idCategoria

    try{
        let sql = `update tbl_categoria set
                  nome =  '${dados.nome}',
                  icone = '${dados.icone}'
                  where id = ${id}`

        let rsCategoria = await prisma.$executeRawUnsafe(sql)

        return rsCategoria
    }catch(error){
        console.log(error)
        return false
    }
}

const deleteCategoria = async function(idSubCategoria) {

    let id = idSubCategoria

    try{
        let sql = `delete from tbl_categoria where id = ${id}`
        
        let rsCategoria = await prisma.$executeRawUnsafe(sql)

        return rsCategoria
    }catch(error){
        console.log(error)
        return false
    }
}

const selectLastInsertId = async function () {

    try{
    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_categoria limit 1`
    let result = await prisma.$queryRawUnsafe(sql)
    
    let id
    result.forEach( idCategoria => {
        id = Number(idCategoria.id)
    })


    if(id){
        return id
    }else{
        return false
    }
    }catch(error){
        console.log(error)
        return false
    }

}


module.exports = {
    selectAllCategorias,
    selectCategoriaById,
    insertCategoria,
    updateCategoria,
    deleteCategoria,
    selectLastInsertId
}
