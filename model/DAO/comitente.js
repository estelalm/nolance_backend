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
        let sql = `select tbl_comitente.id, nome, telefone, email, cpf, rg from tbl_comitente join tbl_pessoa_fisica on tbl_comitente.id=tbl_pessoa_fisica.comitente_id; `

        let rsComitentes = await prisma.$queryRawUnsafe(sql)

        return rsComitentes

    }catch(error){
        console.log(error)
        return false
    }
}
const selectAllComitentesJuridicos = async function() {

    try{
        let sql = `select tbl_comitente.id, nome, telefone, email, cnpj, razao_social, descricao from tbl_comitente join tbl_pessoa_juridica on tbl_comitente.id=tbl_pessoa_juridica.comitente_id`

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
        let sqlFisico = `select tbl_comitente.id, nome, telefone, email, cpf, rg from tbl_comitente 
                        join tbl_pessoa_fisica on tbl_comitente.id=tbl_pessoa_fisica.comitente_id where tbl_comitente.id in(select comitente_id from tbl_pessoa_fisica) and tbl_comitente.id = ${idComitente}`
        let rsComitenteFisico = await prisma.$queryRawUnsafe(sqlFisico)

        let sqlJuridico = `select tbl_comitente.id, nome, telefone, email, cnpj, razao_social, descricao from tbl_comitente 
                            join tbl_pessoa_juridica on tbl_comitente.id=tbl_pessoa_juridica.comitente_id where tbl_comitente.id in(select comitente_id from tbl_pessoa_juridica) and tbl_comitente.id = ${idComitente} 
        `
        let rsComitenteJuridico = await prisma.$queryRawUnsafe(sqlJuridico)
        

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
        let sql = `insert into tbl_pessoa_juridica(cnpj, razao_social, descricao, comitente_id) values 
                    ('${dadosComitente.cnpj}', '${dadosComitente.razao_social}', '${dadosComitente.descricao}', ${id});`

                
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


const updateComitente = async function(dadosComitente, idComitente) {

    let dados = dadosComitente
    let id = idComitente

    try{
        let sql = `update tbl_comitente set
                  nome =  '${dados.nome}',
                  telefone = '${dados.telefone}',
                  email = '${dados.email}'
                  where id = ${id}`

        let rsComitente = await prisma.$executeRawUnsafe(sql)

        return rsComitente
    }catch(error){
        console.log(error)
        return false
    }
}
const updateComitenteJuridico = async function(dadosComitente, idComitente) {

    let dados = dadosComitente
    let id = idComitente

    try{
        let sql = `update tbl_pessoa_juridica set
                  cnpj =  '${dados.cnpj}',
                  razao_social = '${dados.razao_social}',
                  descricao = '${dados.descricao}'
                  where comitente_id=${id} `

        let rsComitente = await prisma.$executeRawUnsafe(sql)

        return rsComitente
    }catch(error){
        console.log(error)
        return false
    }
}
const updateComitenteFisico = async function(dadosComitente, idComitente) {

    let dados = dadosComitente
    let id = idComitente

    try{
        let sql = `update tbl_pessoa_fisica set
                  cpf =  '${dados.cpf}',
                  rg = '${dados.rg}'
                  where comitente_id = ${id}`

        let rsComitente = await prisma.$executeRawUnsafe(sql)
        console.log(rsComitente)
        return rsComitente
    }catch(error){
        console.log(error)
        return false
    }
}

const deleteComitente = async function(idComitente) {

    let id = idComitente
    try{
        let sql = `delete from tbl_comitente where id = ${id}`
        
        let rsComitente = await prisma.$executeRawUnsafe(sql)

        return rsComitente
    }catch(error){
        console.log(error)
        return false
    }
}
const deleteComitenteFisico = async function(idComitente) {

    let id = idComitente
    try{
        let sql = `delete from tbl_pessoa_fisica where comitente_id = ${id}`
        
        let rsComitente = await prisma.$executeRawUnsafe(sql)

        return rsComitente
    }catch(error){
        console.log(error)
        return false
    }
}
const deleteComitenteJuridico = async function(idComitente) {

    let id = idComitente
    try{
        let sql = `delete from tbl_pessoa_juridica where comitente_id = ${id}`
        
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
    updateComitenteFisico,
    updateComitenteJuridico,
    deleteComitente,
    deleteComitenteFisico,
    deleteComitenteJuridico,
    selectLastInsertId
}
