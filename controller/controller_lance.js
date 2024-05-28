/***********************************************************************
 * Objetivo: Arquivo responsável pelas validações e consistências de dados de 'lances'.
 * Data: 21/05/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/

const lancesDAO = require('../model/DAO/lance.js')
const controllerLote = require('../controller/controller_lote.js')
const usuarioDAO = require('../model/DAO/usuario.js')
const message = require('../module/config.js')

const getListarLances = async function () {

    try {

        let lancesJSON = {}

        let dadosLances = await lancesDAO.selectAllLances()

        await Promise.all(dadosLances.map(async lance =>{
            let lanceLote = await controllerLote.getBuscarLote(lance.lote)
            lance.lote = lanceLote.lote
        }))
        await Promise.all(dadosLances.map(async lance =>{
            let usuarioLance = await usuarioDAO.selectByIdUser(lance.usuario)
            lance.usuario = usuarioLance
        }))

        if (dadosLances) {
            if (dadosLances.length > 0) {
                lancesJSON.lances = dadosLances
                lancesJSON.quantidade = dadosLances.length
                lancesJSON.status_code = 200

                return lancesJSON
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

const getBuscarLance = async function (id) {

    let idLance = id

    try {

        if (idLance == undefined || isNaN(idLance) || idLance == "") {
            return message.ERROR_INVALID_ID
        } else {
            let lanceJSON = {}

            let dadosLance = await lancesDAO.selectLanceById(idLance)

            await Promise.all(dadosLance.map(async lance =>{
                let lanceLote = await controllerLote.getBuscarLote(lance.lote)
                lance.lote = lanceLote.lote
            }))
            await Promise.all(dadosLance.map(async lance =>{
                let usuarioLance = await usuarioDAO.selectByIdUser(lance.usuario)
                lance.usuario = usuarioLance
            }))

            if (dadosLance) {
                if (dadosLance.length > 0) {
                    lanceJSON.lance = dadosLance
                    lanceJSON.status_code = 200

                    return lanceJSON
                } else {
                    return message.ERROR_NOT_FOUND
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

const getBuscarArrematante = async function (id) {

    let idLote = id

    try {

        if (idLote == undefined || isNaN(idLote) || idLote == "") {
            return message.ERROR_INVALID_ID
        } else {
            let lanceJSON = {}

            let dadosLance = await lancesDAO.selectArrematante(idLote)

            await Promise.all(dadosLance.map(async lance =>{
                let lanceLote = await controllerLote.getBuscarLote(lance.lote)
                lance.lote = lanceLote.lote
            }))
            await Promise.all(dadosLance.map(async lance =>{
                let usuarioLance = await usuarioDAO.selectByIdUser(lance.usuario)
                lance.usuario = usuarioLance
            }))

            if (dadosLance) {
                if (dadosLance.length > 0) {
                    lanceJSON.lance = dadosLance
                    lanceJSON.status_code = 200

                    return lanceJSON
                } else {
                    return message.ERROR_NOT_FOUND
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

const getFiltrarLance = async function (parametros) {

    try {
            let lanceJSON = {}

            let dadosLance = await lancesDAO.selectLanceByFiltro(parametros)
            console.log(dadosLance)

            await Promise.all(dadosLance.map(async lance =>{
                let lanceLote = await controllerLote.getBuscarLote(lance.lote)
                lance.lote = lanceLote.lote
            }))
            await Promise.all(dadosLance.map(async lance =>{
                let usuarioLance = await usuarioDAO.selectByIdUser(lance.usuario)
                lance.usuario = usuarioLance
            }))

            if (dadosLance) {
                if (dadosLance.length > 0) {
                    lanceJSON.lance = dadosLance
                    lanceJSON.status_code = 200

                    return lanceJSON
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

const setInserirLance = async function (dadosBody, contentType) {

    let dadosLance = dadosBody

    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            let novoLanceJSON = {}

            if (
                dadosLance.data == "" || dadosLance.data == undefined || dadosLance.data == null || dadosLance.data.length > 10 ||
                dadosLance.valor == "" || dadosLance.valor == undefined || dadosLance.valor == null || isNaN(dadosLance.valor) ||
                dadosLance.lote == "" || dadosLance.lote == undefined || dadosLance.lote == null || isNaN(dadosLance.lote) ||
                dadosLance.usuario == "" || dadosLance.usuario == undefined || dadosLance.usuario == null || isNaN(dadosLance.usuario) 
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {

                let novoLance = await lancesDAO.insertLance(dadosLance)
                let novoLanceId = await lancesDAO.selectLastInsertId()

                let dadosNovoLance = await getBuscarLance(novoLanceId)

                if (novoLance) {
                    novoLanceJSON.lance = dadosNovoLance.lance
                    novoLanceJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    novoLanceJSON.status = message.SUCCESS_CREATED_ITEM.status
                    novoLanceJSON.message = message.SUCCESS_CREATED_ITEM.message

                    return novoLanceJSON

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

const setAtualizarLance = async function (id, dadosBody, contentType) {

    let dadosLance = dadosBody
    let idLance = id

    
    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            if (idLance == undefined || isNaN(idLance) || idLance == "") {
                return message.ERROR_INVALID_ID
            } else {

                let lanceAtualizadaJSON = {}

                if (dadosLance.nome == "" || dadosLance.nome == undefined || dadosLance.nome == null || dadosLance.nome.length > 45 ||
                dadosLance.data_inicio == "" || dadosLance.data_inicio == undefined || dadosLance.data_inicio == null || dadosLance.data_inicio.length > 10 ||
                dadosLance.descricao == "" || dadosLance.descricao == undefined || dadosLance.descricao == null || 
                dadosLance.reserva == "" || dadosLance.reserva == undefined || dadosLance.reserva == null || isNaN(dadosLance.reserva) ||
                dadosLance.status == "" || dadosLance.status == undefined || dadosLance.status == null || isNaN(dadosLance.status) ||
                dadosLance.leilao == "" || dadosLance.leilao == undefined || dadosLance.leilao == null || isNaN(dadosLance.leilao)  ) {

                    return message.ERROR_REQUIRED_FIELDS
                } else {


                    let lanceAtualizada = await lancesDAO.updateLance(dadosBody, idLance)


                    // let dadosLanceAtualizado = await getBuscarLance(idLance)

                    if (lanceAtualizada) {
                        // lanceAtualizadaJSON.lance = dadosLanceAtualizado.lance
                        lanceAtualizadaJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        lanceAtualizadaJSON.status = message.SUCCESS_UPDATED_ITEM.status
                        lanceAtualizadaJSON.message = message.SUCCESS_UPDATED_ITEM.message

                        return lanceAtualizadaJSON

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

const setExcluirLance = async function (id) {

    let idLance = id

    try {

        if (idLance == undefined || isNaN(idLance) || idLance == "") {
            return message.ERROR_INVALID_ID
        } else {
            let lanceExcluidaJSON = {}

            let dadosLanceExcluida = await lancesDAO.deleteLance(idLance)

            if (dadosLanceExcluida) {
                lanceExcluidaJSON.status_code = message.SUCCESS_DELETED_ITEM.status_code
                lanceExcluidaJSON.status = message.SUCCESS_DELETED_ITEM.status
                lanceExcluidaJSON.message = message.SUCCESS_DELETED_ITEM.message

                    return lanceExcluidaJSON
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {

        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    getListarLances,
    getBuscarLance,
    getBuscarArrematante,
    getFiltrarLance,
    setInserirLance,
    setAtualizarLance,
    setExcluirLance
}