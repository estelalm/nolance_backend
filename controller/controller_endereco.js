const message = require('../module/config.js')

const enderecoDAO = require('../model/DAO/endereco.js')

const getListarEnderecos = async () => {
    let enderecoJSON = {}

    let dadosEndereco = await enderecoDAO.selectAllAddress()

    if(dadosEndereco){
        if(dadosEndereco.length > 0){
            enderecoJSON.endereco = dadosEndereco
            enderecoJSON.quantidade = dadosEndereco.length
            enderecoJSON.status_code = 200;

            return enderecoJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const atualizarEndereco = async (dados, id , contentType) => {
    try {
        if(String(contentType).toLowerCase() == 'application/json'){
            let enderecoAtualizadoJSON = {}

            if(id == '' || id == undefined || isNaN(id) || dados.cep == '' || dados.cep == undefined || dados.cep == null|| dados.cep.length != 9|| dados.numero == ''|| dados.numero == undefined || dados.numero == null || isNaN(dados.numero)){
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let enderecoId = await enderecoDAO.selectByIdEndereco(id)

                if (enderecoId.length > 0) {
                    let enderecoAtualizado = await enderecoDAO.updateEndereco(dados, id)
                    if (enderecoAtualizado) {
                        enderecoAtualizadoJSON.enderecoAtualizado = dados
                        enderecoAtualizado.status = message.SUCCESS_UPDATED_ITEM.status
                        enderecoAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        enderecoAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message

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

const adicionarEndereco = async (dadosEndereco, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novoEnderecoJSON = {}

            if (dadosEndereco.cep == '' || dadosEndereco.cep == undefined || dadosEndereco.cep == null || dadosEndereco.cep.length != 9 ||
                dadosEndereco.numero == '' || dadosEndereco.numero == undefined || dadosEndereco.numero == null || isNaN(dadosEndereco.numero)
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {

                let novoEndereco = await enderecoDAO.insertEndereco(dadosEndereco)

                let id = await enderecoDAO.selectLastId()

                if (novoEndereco) {
                    dadosEndereco.id = id[0].id
                    novoEnderecoJSON.endereco = dadosEndereco
                    novoEnderecoJSON.status = message.SUCCESS_CREATED_ITEM.status
                    novoEnderecoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    novoEnderecoJSON.message = message.SUCCESS_CREATED_ITEM.message

                    return novoEnderecoJSON
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

const deletarEndereco = async (id) => {
    try {
        let idEndereco = id

        if (idEndereco == '' || idEndereco == undefined || isNaN(idEndereco)) {
            return message.ERROR_INVALID_ID
        } else {
            let enderecoId = await enderecoDAO.selectByIdEndereco(idEndereco)

            if (enderecoId.length > 0) {
                let enderecoExcluido = await enderecoDAO.deletar(idEndereco)
                if (enderecoExcluido) {
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
    getListarEnderecos,
    deletarEndereco,
    atualizarEndereco,
    adicionarEndereco
}