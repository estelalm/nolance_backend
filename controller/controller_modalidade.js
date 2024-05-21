const message = require('../module/config.js')

const modalidadeDAO = require('../model/DAO/modalidade.js')

const listarTodasModalidades = async () => {
    let modalidadeJSON = {}

    let dadosModalidade = await modalidadeDAO.selectAllModalidades()

    if(dadosModalidade){
        if(dadosModalidade.length > 0){
            modalidadeJSON.modalidades = dadosModalidade
            modalidadeJSON.quantidade = dadosModalidade.length
            modalidadeJSON.status_code = 200;

            return modalidadeJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const atualizarModalidade = async (dados, id , contentType) => {
    try {
        if(String(contentType).toLowerCase() == 'application/json'){
            let modalidadeAtualizadaJSON = {}

            if(id == '' || id == undefined || isNaN(id) || dados.nome == '' || dados.nome == undefined || dados.nome == null){
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let modalidade = await modalidadeDAO.selectByIdModalidade(id)

                if (modalidade.length > 0) {
                    let modalidadeAtualizada = await modalidadeDAO.updateModalidade(dados, id)
                    if (modalidadeAtualizada) {
                        modalidadeAtualizadaJSON.modalidade = dados
                        modalidadeAtualizada.status = message.SUCCESS_UPDATED_ITEM.status
                        modalidadeAtualizadaJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        modalidadeAtualizadaJSON.message = message.SUCCESS_UPDATED_ITEM.message

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

const deletarModalidade = async (id) => {
    try {
        let idModalidade = id

        if (idModalidade == '' || idModalidade == undefined || isNaN(idModalidade)) {
            return message.ERROR_INVALID_ID
        } else {
            let modalidadeId = await modalidadeDAO.selectByIdModalidade(idModalidade)

            if (modalidadeId.length > 0) {
                let modalidadeExluida = await modalidadeDAO.deletar(idModalidade)
                if (modalidadeExluida) {
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
    listarTodasModalidades,
    atualizarModalidade,
    deletarModalidade
}