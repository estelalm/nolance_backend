/***********************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados no Banco SQL;
 *              aqui realizamos o CRUD na linguagem SQL.
 * Data: 21/05/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/


const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

const selectAllComitentes = async function() {

    try{
        let sql = `select * from tbl_comitente`

        let rsComitentes = await prisma.$queryRawUnsafe(sql)

        return rsComitentes

    }catch(error){
        console.log(error)
        return false
    }
}

const selectComitenteById = async function(id) {

    let idComitente = id

    try{
        let sql = `select * from tbl_comitente where id = ${idComitente}`

        let rsComitente = await prisma.$queryRawUnsafe(sql)

        return rsComitente
    }catch(error){
        return false
    }
}

const insertComitente = async function(dados) {

    let dadosComitente = dados

    try{
        let sql = `insert into tbl_comitente(nome, icone) values 
                    ('${dadosComitente.nome}', '${dadosComitente.icone}');`

        let rsComitente = await prisma.$executeRawUnsafe(sql)

        return rsComitente
    }catch(error){
        console.log(error)
        return false
    }
}

const updateComitente = async function(dadosSubComitente, idComitente) {

    let dados = dadosSubComitente
    let id = idComitente

    try{
        let sql = `update tbl_comitente set
                  nome =  '${dados.nome}',
                  icone = '${dados.icone}'
                  where id = ${id}`

        let rsComitente = await prisma.$executeRawUnsafe(sql)

        return rsComitente
    }catch(error){
        console.log(error)
        return false
    }
}

const deleteComitente = async function(idSubComitente) {

    let id = idSubComitente

    try{
        let sql = `delete from tbl_comitente where id = ${id}`
        
        let rsComitente = await prisma.$executeRawUnsafe(sql)

        return rsComitente
    }catch(error){
        console.log(error)
        return false
    }
}

const selectLastInsertId = async function () {

    try{
    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_comitente limit 1`
    let result = await prisma.$queryRawUnsafe(sql)
    
    let id
    result.forEach( idComitente => {
        id = Number(idComitente.id)
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
    selectAllComitentes,
    selectComitenteById,
    insertComitente,
    updateComitente,
    deleteComitente,
    selectLastInsertId
}
