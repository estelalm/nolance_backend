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
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

const getArrematesUsuario = async function (id){
    try {

        if (id == undefined || isNaN(id) || id == "") {
            return message.ERROR_INVALID_ID
        } else {
            let lanceJSON = {}

            let dadosLotesUsuario = await lancesDAO.selectLanceByFiltro({ usuario_id: id })

            let lancesArray = []
            await Promise.all(dadosLotesUsuario.map(async lote =>{
                let dadosLance = await lancesDAO.selectArrematante(lote.id)
                console.log(dadosLance)
                lancesArray.push(dadosLance)
            }))
            
            await Promise.all(lancesArray.map(async lance =>{
                let lanceLote = await controllerLote.getBuscarLote(lance.lote)
                lance.lote = lanceLote.lote
            }))
            await Promise.all(lancesArray.map(async lance =>{
                let usuarioLance = await usuarioDAO.selectByIdUser(lance.usuario)
                lance.usuario = usuarioLance
            }))

            if (lancesArray) {
                if (lancesArray.length > 0) {
                    lanceJSON.lance = lancesArray
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
                dadosLance.data_lance == "" || dadosLance.data_lance == undefined || dadosLance.data_lance == null || dadosLance.data_lance.length > 10 ||
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
    getArrematesUsuario,
    getFiltrarLance,
    setInserirLance,
    setExcluirLance
}