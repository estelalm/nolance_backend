/***********************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados no Banco SQL;
 *              aqui realizamos o CRUD na linguagem SQL.
 * Data: 21/05/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/


const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient



const selectAllComitentesFisicos = async function() {

    try{
        let sql = `select * from tbl_comitente join tbl_pessoa_fisica on tbl_comitente.id=tbl_pessoa_fisica.comitente_id; `

        let rsComitentes = await prisma.$queryRawUnsafe(sql)

        return rsComitentes

    }catch(error){
        console.log(error)
        return false
    }
}
const selectAllComitentesJuridicos = async function() {

    try{
        let sql = `select * from tbl_comitente join tbl_pessoa_juridica on tbl_comitente.id=tbl_pessoa_juridica.comitente_id`

        let rsComitentes = await prisma.$queryRawUnsafe(sql)

        return rsComitentes

    }catch(error){
        console.log(error)
        return false
    }
}


// const selectComitenteById2 = async function(id, tipo) {

//     let idComitente = id

//     try{
//         let sql 
//         if(tipo == "fisico"){
//             sql = `select * from tbl_comitente join tbl_pessoa_fisica on tbl_comitente.id=tbl_pessoa_fisica.comitente_id where id = ${idComitente}`
//         }else{ 
//             sql = `select * from tbl_comitente join tbl_pessoa_juridica on tbl_comitente.id=tbl_pessoa_juridica.comitente_id where id = ${idComitente}`
//         }
//         let rsComitente = await prisma.$queryRawUnsafe(sql)

//         return rsComitente
//     }catch(error){
//         return false
//     }
// }


const selectComitenteById = async function(id) {

    let idComitente = id

    try{
        let sqlFisico = `select tbl_comitente.id, nome, telefone, email, cpf, rg from tbl_comitente 
                        join tbl_pessoa_fisica on tbl_comitente.id=tbl_pessoa_fisica.comitente_id where tbl_comitente.id in(select comitente_id from tbl_pessoa_fisica) and tbl_comitente.id = ${idComitente}`
        let rsComitenteFisico = await prisma.$queryRawUnsafe(sqlFisico)

        let sqlJuridico = `select tbl_comitente.id, nome, telefone, email, cnpj, razao_social, descricao from tbl_comitente 
                            join tbl_pessoa_juridica on tbl_comitente.id=tbl_pessoa_juridica.comitente_id where tbl_comitente.id in(select comitente_id from tbl_pessoa_juridica) and tbl_comitente.id = ${idComitente} 
        `
        let rsComitenteJuridico = await prisma.$queryRawUnsafe(sqlJuridico)
        console.log(rsComitenteFisico, rsComitenteJuridico)

        if(rsComitenteFisico.length > 0){
            return rsComitenteFisico
        }else if(rsComitenteJuridico.length > 0){
            return rsComitenteJuridico
        }else{
            return false
        }
    }catch(error){
        console.log(error)
        return false
    }
}

const insertComitente = async function(dados) {

    let dadosComitente = dados

    try{
        let sql = `insert into tbl_comitente(nome, telefone, email) values 
                    ('${dadosComitente.nome}', '${dadosComitente.telefone}', '${dadosComitente.email}');`

        let rsComitente = await prisma.$executeRawUnsafe(sql)

        return rsComitente
    }catch(error){
        console.log(error)
        return false
    }
}
const insertComitenteJuridico = async function(dados, id) {

    let dadosComitente = dados

    try{
        let sql = `insert into tbl_comitente(cnpj, razao_social, descricao, comitente_id) values 
                    ('${dadosComitente.cnpj}', '${dadosComitente.razao_social}', '${dadosComitente.descricao}', ${id});`

                    console.log(sql)
        let rsComitente = await prisma.$executeRawUnsafe(sql)

        return rsComitente
    }catch(error){
        console.log(error)
        return false
    }
}
const insertComitenteFisico = async function(dados, id) {

    let dadosComitente = dados

    try{
        let sql = `insert into tbl_pessoa_fisica(cpf, rg, comitente_id) values 
                    ('${dadosComitente.cpf}', '${dadosComitente.rg}', ${id});`

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
    selectAllComitentesFisicos,
    selectAllComitentesJuridicos,
    selectComitenteById,
    insertComitente,
    insertComitenteFisico,
    insertComitenteJuridico,
    updateComitente,
    deleteComitente,
    selectLastInsertId
}
