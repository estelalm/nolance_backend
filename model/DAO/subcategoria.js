/***********************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados no Banco SQL;
 *              aqui realizamos o CRUD na linguagem SQL.
 * Data: 21/05/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/


const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

const selectAllSubcategorias = async function() {

    try{
        let sql = `select id, nome, categoria_id as categoria from tbl_subcategoria`

        let rsSubcategorias = await prisma.$queryRawUnsafe(sql)

        return rsSubcategorias

    }catch(error){
        console.log(error)
        return false
    }
}

const selectSubcategoriaById = async function(id) {

    let idCategoria = id

    try{
        let sql = `select id, nome, categoria_id as categoria from tbl_subcategoria where id = ${idCategoria}`

        let rsSubcategoria = await prisma.$queryRawUnsafe(sql)

        return rsSubcategoria
    }catch(error){
        return false
    }
}

const selectSubcategoriaByCategoria = async function(id) {

    let idCategoria = id

    try{
        let sql = `select tbl_subcategoria.id, tbl_subcategoria.nome from tbl_subcategoria join tbl_categoria on tbl_subcategoria.categoria_id=tbl_categoria.id
         where tbl_categoria.id = ${idCategoria}`

        let rsSubcategoria = await prisma.$queryRawUnsafe(sql)

        return rsSubcategoria
    }catch(error){
        console.log(error)
        return false
    }
}

const insertSubcategoria = async function(dados) {

    let dadosCategoria = dados

    try{
        let sql = `insert into tbl_subcategoria(nome, categoria_id) values 
                    ('${dadosCategoria.nome}',${dadosCategoria.categoria});`

        let rsSubcategoria = await prisma.$executeRawUnsafe(sql)

        return rsSubcategoria
    }catch(error){
        return false
    }
}

const updateSubcategoria = async function(dadosSubCategoria, idSubcategoria) {

    let dados = dadosSubCategoria
    let id = idSubcategoria

    try{
        let sql = `update tbl_subcategoria set
                  nome =  '${dados.nome}',
                  categoria_id = ${dados.categoria}
                  where id = ${id}`

        let rsSubcategoria = await prisma.$executeRawUnsafe(sql)

        return rsSubcategoria
    }catch(error){
        console.log(error)
        return false
    }
}

const deleteSubcategoria = async function(idSubCategoria) {

    let id = idSubCategoria

    try{
        let sql = `delete from tbl_subcategoria where id = ${id}`
        
        let rsSubcategoria = await prisma.$executeRawUnsafe(sql)

        return rsSubcategoria
    }catch(error){
        console.log(error)
        return false
    }
}

const selectLastInsertId = async function () {

    try{
    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_subcategoria limit 1`
    let result = await prisma.$queryRawUnsafe(sql)
    
    let id
    result.forEach( idSubcategoria => {
        id = Number(idSubcategoria.id)
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
    selectAllSubcategorias,
    selectSubcategoriaById,
    selectSubcategoriaByCategoria,
    insertSubcategoria,
    updateSubcategoria,
    deleteSubcategoria,
    selectLastInsertId
}
