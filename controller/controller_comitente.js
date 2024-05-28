/***********************************************************************
 * Objetivo: Arquivo responsável pelas validações e consistências de dados de 'comitentes'.
 * Data: 21/05/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/

const message = require('../module/config.js')
const comitentesDAO = require('../model/DAO/comitentes.js')

const getListarComitentes = async function () {

    try {

        let comitentesJSON = {}

        let dadosComitentesFisicos = await comitentesDAO.selectAllComitentesFisicos()
        let dadosComitentesJuridicos = await comitentesDAO.selectAllComitentesJuridicos()


        if (dadosComitentesFisicos && dadosComitentesJuridicos) {
            if (dadosComitentesFisicos.length > 0 || dadosComitentesJuridicos > 0) {

                if(dadosComitentesFisicos.length > 0)
                comitentesJSON.comitentes_fisicos = dadosComitentesFisicos
                else
                comitentesJSON.comitentes_fisicos = message.ERROR_NOT_FOUND

                if(dadosComitentesJuridicos.length > 0)
                comitentesJSON.comitentes_juridicos = dadosComitentesJuridicos
                else
                comitentesJSON.comitentes_juridicos = message.ERROR_NOT_FOUND


                comitentesJSON.quantidade = dadosComitentesFisicos.length + dadosComitentesJuridicos.length
                comitentesJSON.status_code = 200

                return comitentesJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

const getBuscarComitente = async function (id) {

    let idComitente = id

    try {

        if (idComitente == undefined || isNaN(idComitente) || idComitente == "") {
            return message.ERROR_INVALID_ID
        } else {
            let comitenteJSON = {}

            let dadosComitente = await comitentesDAO.selectComitenteById(idComitente)

            if (dadosComitente) {
                if (dadosComitente.length > 0) {
                    comitenteJSON.comitente = dadosComitente
                    comitenteJSON.status_code = 200

                    return comitenteJSON
                } else {
                    return message.ERROR_NOT_FOUND
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const setInserirComitenteFisico = async function (dadosBody, contentType) {

    let dadosComitente = dadosBody

    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            let novoComitenteJSON = {}

            if (dadosComitente.nome == "" || dadosComitente.nome == undefined || dadosComitente.nome == null || dadosComitente.nome.length > 45 ||
                dadosComitente.telefone == "" || dadosComitente.telefone == undefined || dadosComitente.telefone == null ||
                dadosComitente.email == "" || dadosComitente.email == undefined || dadosComitente.email == null ||
                dadosComitente.rg == "" || dadosComitente.rg == undefined || dadosComitente.rg == null ||
                dadosComitente.cpf == "" || dadosComitente.cpf == undefined || dadosComitente.cpf == null || dadosComitente.cpf.length > 11) {
                return message.ERROR_REQUIRED_FIELDS
            } else {

                let novoComitente = await comitentesDAO.insertComitente(dadosBody)
                let novoComitenteId = await comitentesDAO.selectLastInsertId()
                let novoComitenteFisico = await comitentesDAO.insertComitenteFisico(dadosBody, novoComitenteId)
                let dadosNovaComitente = await getBuscarComitente(novoComitenteId)

                

                if (novoComitente, novoComitenteFisico) {
                    novoComitenteJSON.comitente = dadosNovaComitente.comitente
                    novoComitenteJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    novoComitenteJSON.status = message.SUCCESS_CREATED_ITEM.status
                    novoComitenteJSON.message = message.SUCCESS_CREATED_ITEM.message

                    return novoComitenteJSON

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }

        } else {
            return message.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }

}

const setInserirComitenteJuridico = async function (dadosBody, contentType) {

    let dadosComitente = dadosBody

    try {
        
        if (String(contentType).toLowerCase() == 'application/json') {

            let novoComitenteJSON = {}

            if (dadosComitente.nome == "" || dadosComitente.nome == undefined || dadosComitente.nome == null || dadosComitente.nome.length > 45||
            dadosComitente.telefone == "" || dadosComitente.telefone == undefined || dadosComitente.telefone == null ||
            dadosComitente.email == "" || dadosComitente.email == undefined || dadosComitente.email == null ||
            dadosComitente.cnpj == "" || dadosComitente.cnpj == undefined || dadosComitente.cnpj == null || dadosComitente.cnpj.length > 15 ||
            dadosComitente.razao_social == "" || dadosComitente.razao_social == undefined || dadosComitente.razao_social == null || dadosComitente.razao_social.length > 50 ||
            dadosComitente.descricao == "" || dadosComitente.descricao == undefined || dadosComitente.descricao == null
             ) {
                
                return message.ERROR_REQUIRED_FIELDS
            } else {

                let novoComitente = await comitentesDAO.insertComitente(dadosComitente)
                let novoComitenteId = await comitentesDAO.selectLastInsertId()
                let novoComitenteJuridico = await comitentesDAO.insertComitenteJuridico(dadosComitente, novoComitenteId)
                let dadosNovaComitente = await getBuscarComitente(novoComitenteId)

                if (novoComitente, novoComitenteJuridico) {
                    novoComitenteJSON.comitente = dadosNovaComitente.comitente
                    novoComitenteJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    novoComitenteJSON.status = message.SUCCESS_CREATED_ITEM.status
                    novoComitenteJSON.message = message.SUCCESS_CREATED_ITEM.message

                    return novoComitenteJSON

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }

        } else {
            return message.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }

}


const setAtualizarComitenteFisico = async function (id, dadosBody, contentType) {

    let dadosComitente = dadosBody
    let idComitente = id
    
    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            if (idComitente == undefined || isNaN(idComitente) || idComitente == "") {
                return message.ERROR_INVALID_ID
            } else {

                let comitenteAtualizadoJSON = {}

                if (dadosComitente.nome == "" || dadosComitente.nome == undefined || dadosComitente.nome == null || dadosComitente.nome.length > 45 ||
                    dadosComitente.telefone == "" || dadosComitente.telefone == undefined || dadosComitente.telefone == null ||
                    dadosComitente.email == "" || dadosComitente.email == undefined || dadosComitente.email == null ||
                    dadosComitente.rg == "" || dadosComitente.rg == undefined || dadosComitente.rg == null ||
                    dadosComitente.cpf == "" || dadosComitente.cpf == undefined || dadosComitente.cpf == null
                ) {
                    return message.ERROR_REQUIRED_FIELDS
                } else {

                    let comitenteAtualizado = await comitentesDAO.updateComitente(dadosBody, idComitente)
                    let comitenteFisicoAtualizado = await comitentesDAO.updateComitenteFisico(dadosBody, idComitente)

                    let dadosComitente = await getBuscarComitente(idComitente)

                    if (comitenteAtualizado && comitenteFisicoAtualizado) {
                        comitenteAtualizadoJSON.comitente = dadosComitente.comitente
                        comitenteAtualizadoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        comitenteAtualizadoJSON.status = message.SUCCESS_CREATED_ITEM.status
                        comitenteAtualizadoJSON.message = message.SUCCESS_CREATED_ITEM.message

                        return comitenteAtualizadoJSON

                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB
                    }
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }

}

const setAtualizarComitenteJuridico = async function (id, dadosBody, contentType) {

    let dadosComitente = dadosBody
    let idComitente = id
    
    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            if (idComitente == undefined || isNaN(idComitente) || idComitente == "") {
                return message.ERROR_INVALID_ID
            } else {

                let comitenteAtualizadoJSON = {}

                if (dadosComitente.nome == "" || dadosComitente.nome == undefined || dadosComitente.nome == null || dadosComitente.nome.length > 45 ||
                    dadosComitente.telefone == "" || dadosComitente.telefone == undefined || dadosComitente.telefone == null ||
                    dadosComitente.email == "" || dadosComitente.email == undefined || dadosComitente.email == null ||
                    dadosComitente.cnpj == "" || dadosComitente.cnpj == undefined || dadosComitente.cnpj == null ||
                    dadosComitente.razao_social == "" || dadosComitente.razao_social == undefined || dadosComitente.razao_social == null ||
                    dadosComitente.descricao == "" || dadosComitente.descricao == undefined || dadosComitente.descricao == null
                ) {
                    return message.ERROR_REQUIRED_FIELDS
                } else {

                    let comitenteAtualizado = await comitentesDAO.updateComitente(dadosBody, idComitente)
                    let comitenteFisicoAtualizado = await comitentesDAO.updateComitenteJuridico(dadosBody, idComitente)

                    let dadosComitente = await getBuscarComitente(idComitente)

                    if (comitenteAtualizado && comitenteFisicoAtualizado) {
                        comitenteAtualizadoJSON.comitente = dadosComitente.comitente
                        comitenteAtualizadoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        comitenteAtualizadoJSON.status = message.SUCCESS_CREATED_ITEM.status
                        comitenteAtualizadoJSON.message = message.SUCCESS_CREATED_ITEM.message

                        return comitenteAtualizadoJSON

                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB
                    }
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }

}

const setExcluirComitenteFisico = async function (id) {

    let idComitente = id

    try {

        if (idComitente == undefined || isNaN(idComitente) || idComitente == "") {
            return message.ERROR_INVALID_ID
        } else {
            let comitenteExcluidoJSON = {}

            let dadosComitenteExcluido
            let dadosComitenteFisicoExcluido = await comitentesDAO.deleteComitenteFisico(idComitente)
            
                dadosComitenteExcluido = await comitentesDAO.deleteComitente(idComitente)
            
            


            if (dadosComitenteExcluido && dadosComitenteFisicoExcluido) {
                comitenteExcluidoJSON.status_code = message.SUCCESS_DELETED_ITEM.status_code
                comitenteExcluidoJSON.status = message.SUCCESS_DELETED_ITEM.status
                comitenteExcluidoJSON.message = message.SUCCESS_DELETED_ITEM.message

                    return comitenteExcluidoJSON
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {

        return message.ERROR_INTERNAL_SERVER
    }
}

const setExcluirComitenteJuridico = async function (id) {

    let idComitente = id

    try {

        if (idComitente == undefined || isNaN(idComitente) || idComitente == "") {
            return message.ERROR_INVALID_ID
        } else {
            let comitenteExcluidoJSON = {}

            let dadosComitenteExcluido
            let dadosComitenteJuridicoExcluido = await comitentesDAO.deleteComitenteJuridico(idComitente)
            if(dadosComitenteJuridicoExcluido){
             await comitentesDAO.deleteComitente(idComitente)
            }

            if ( dadosComitenteJuridicoExcluido) {
                comitenteExcluidoJSON.status_code = message.SUCCESS_DELETED_ITEM.status_code
                comitenteExcluidoJSON.status = message.SUCCESS_DELETED_ITEM.status
                comitenteExcluidoJSON.message = message.SUCCESS_DELETED_ITEM.message

                    return comitenteExcluidoJSON
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {

        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    getListarComitentes,
    getBuscarComitente,
    setInserirComitenteFisico,
    setInserirComitenteJuridico,
    setAtualizarComitenteFisico,
    setAtualizarComitenteJuridico,
    setExcluirComitenteFisico,
    setExcluirComitenteJuridico
}