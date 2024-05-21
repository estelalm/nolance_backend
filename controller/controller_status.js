const message = require('../module/config.js')

const statusDAO = require('../model/DAO/status.js')

const getListarStatus = async () => {
    let statusJSON = {}

    let dadosStatus = await statusDAO.selectAllStatus()

    if(dadosStatus){
        if(dadosStatus.length > 0){
            statusJSON.status = dadosStatus
            statusJSON.quantidade = dadosStatus.length
            statusJSON.status_code = 200;

            return statusJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const atualizarStatus = async (dados, id , contentType) => {
    try {
        if(String(contentType).toLowerCase() == 'application/json'){
            let statusAtualizadoJSON = {}

            if(id == '' || id == undefined || isNaN(id) || dados.nome == '' || dados.nome == undefined || dados.nome == null|| dados.cor == ''|| dados.cor == undefined || dados.cor == null || dados.cor.length != 7){
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let statusId = await statusDAO.selectByIdStatus(id)

                if (statusId.length > 0) {
                    let statusAtualizado = await statusDAO.updateStatus(dados, id)
                    if (statusAtualizado) {
                        statusAtualizadoJSON.statusAtualizado = dados
                        statusAtualizado.status = message.SUCCESS_UPDATED_ITEM.status
                        statusAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        statusAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message

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

const deletarStatus = async (id) => {
    try {
        let idStatus = id

        if (idStatus == '' || idStatus == undefined || isNaN(idStatus)) {
            return message.ERROR_INVALID_ID
        } else {
            let statusId = await statusDAO.selectByIdStatus(idStatus)

            if (statusId.length > 0) {
                let statusExcluido = await usuariosDAO.deletar(idStatus)
                if (statusExcluido) {
                    return message.SUCCESS_DELETED_ITEM
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            } else {
                return message.ERROR_NOT_FOUND
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    getListarStatus,
    atualizarStatus,
    deletarStatus
}