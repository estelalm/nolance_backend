/***********************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados no Banco SQL;
 *              aqui realizamos o CRUD na linguagem SQL.
 * Data: 28/05/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/



const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

const selectAllLances = async function() {

    try{
        let sql = `select id, data_lance, valor, lote_id as lote, usuario_id as usuario from tbl_lance`

        let rsLances = await prisma.$queryRawUnsafe(sql)

        return rsLances

    }catch(error){
        console.log(error)
        return false
    }
}

const selectLanceById = async function(id) {

    let idLance = id

    try{
        let sql = `select id, data_lance, valor, lote_id as lote, usuario_id as usuario from tbl_lance where id = ${idLance}`

        let rsLance = await prisma.$queryRawUnsafe(sql)

        return rsLance
    }catch(error){
        return false
    }
}

const selectLanceByFiltro = async function(params) {

    try{

        let keys = Object.keys(params)
       console.log(params)
        let condition
        keys.forEach(async key => {
            if (condition) {
                condition += ` and ${key} like "%${params[key]}%"`
            } else {
                condition = `${key} like "%${params[key]}%"`
            }
        })
        let sql = `select id, data_lance, valor, lote_id as lote, usuario_id as usuario from tbl_lance where ${condition}`
        console.log(sql)

        let rsLance = await prisma.$queryRawUnsafe(sql)

        return rsLance
    }catch(error){
        return false
    }
}

const selectArrematante = async function(idLote) {

    try{
        let sql = `select distinct * from tbl_lance where lote_id = ${idLote} and valor in (select distinct max(valor) as valor from tbl_lance where lote_id = ${idLote}) `

        let rsLance = await prisma.$queryRawUnsafe(sql)

        return rsLance
    }catch(error){
        return false
    }
}


const insertLance = async function(dados) {

    let dadosLance = dados

    try{
        let sql = `insert into tbl_lance(data_lance, valor, lote_id, usuario_id) values 
                ('${dadosLance.data_lance}', ${dadosLance.valor}, ${dadosLance.lote}, ${dadosLance.usuario});`

        let rsLance = await prisma.$executeRawUnsafe(sql)

        return rsLance
    }catch(error){
        console.log(error)
        return false
    }
}


const deleteLance = async function(idLance) {

    let id = idLance

    try{
        let sql = `delete from tbl_lance where id = ${id}`
        
        let rsLance = await prisma.$executeRawUnsafe(sql)

        return rsLance
    }catch(error){
        console.log(error)
        return false
    }
}


const selectLastInsertId = async function () {

    try{
    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_lance limit 1`
    let result = await prisma.$queryRawUnsafe(sql)
    
    let id
    result.forEach( idLance => {
        id = Number(idLance.id)
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
    selectAllLances,
    selectLanceById,
    selectLanceByFiltro,
    selectArrematante,
    insertLance,
    deleteLance,
    selectLastInsertId
}
