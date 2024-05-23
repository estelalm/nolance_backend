const categoriasDAO = require('../model/DAO/categorias.js')
const usuariosDAO = require('../model/DAO/status.js')
const interesseDAO = require('../model/DAO/interesse.js')
const message = require('../module/config.js')

const listInteresses = async () => {
    let interessesJSON = {}

    let dadosInteresses = await interesseDAO.selectAllInterests()

    if (dadosInteresses) {
        if (dadosInteresses.length > 0) {
            interessesJSON.interesses = dadosInteresses
            interessesJSON.quantidade = dadosInteresses.length
            interessesJSON.status_code = 200;

            return interessesJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const addNewUserInterest = async (dados, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let newInterestJSON = {}

            if (dados.categoria_id == '' || dados.categoria_id == undefined || dados.categoria_id == null ||
                dados.usuario_id == '' || dados.usuario_id == undefined || dados.usuario_id == null || isNaN(dados.usuario_id)
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let newInterest
                for (let i = 0; i < dados.categoria_id.length; i++) {
                    let idCategoria = dados.categoria_id[i]
                    newInterest = await interesseDAO.insertNewInterest(idCategoria, dados.usuario_id);
                }

                let id = await interesseDAO.selectLastId()

                if (newInterest) {
                    dados.id = id[0].id
                    newInterestJSON.interesse = dados
                    newInterestJSON.status = message.SUCCESS_CREATED_ITEM.status
                    newInterestJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    newInterestJSON.message = message.SUCCESS_CREATED_ITEM.message

                    return newInterestJSON
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }

            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const updateInterest = async (dados, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let interesseAtualizadoJSON = {}

            if (id == '' || id == undefined || isNaN(id) ||
                dados.categoria_id == '' || dados.categoria_id == undefined || dados.categoria_id == null ||
                dados.usuario_id == '' || dados.usuario_id == undefined || dados.usuario_id == null || isNaN(dados.usuario_id))
                 {
                return message.ERROR_REQUIRED_FIELDS
            } else {

                await interesseDAO.deleteUserInterest(id);

                let newInterest
                for (let i = 0; i < dados.categoria_id.length; i++) {
                    let idCategoria = dados.categoria_id[i]
                    newInterest = await interesseDAO.insertNewInterest(idCategoria, id);
                }

                if (!newInterest) {
                    return message.ERROR_INTERNAL_SERVER_DB;
                }

                let interesse = await interesseDAO.selectInterestByUserId(id)
                delete dados.categoria_id
                dados.categorias = interesse;

                if (interesse.length > 0) {
                    if (interesse) {
                        interesseAtualizadoJSON.interessesAtualizados = dados
                        interesseAtualizadoJSON.status = message.SUCCESS_UPDATED_ITEM.status
                        interesseAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        interesseAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message

                        return message.SUCCESS_UPDATED_ITEM
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB //500
                    }

                } else {
                    return message.ERROR_NOT_FOUND
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}


module.exports = {
    listInteresses,
    addNewUserInterest,
    updateInterest
}