/***********************************************************************
 * Objetivo: Arquivo responsável pelas validações e consistências de dados de 'subcategorias'.
 * Data: 21/05/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/

const subcategoriasDAO = require('../model/DAO/subcategorias.js')
const categoriasDAO = require('../model/DAO/categorias.js')
const message = require('../module/config.js')
const categorias = require('../model/DAO/categorias.js')

const getListarSubcategorias = async function () {

    try {

        let subcategoriasJSON = {}

        let dadosSubcategorias = await subcategoriasDAO.selectAllSubcategorias()

        await Promise.all(dadosSubcategorias.map(async subcategoria =>{
            let categoriaResult = await categoriasDAO.selectCategoriaById(subcategoria.categoria)
            subcategoria.categoria = categoriaResult
        }))

        if (dadosSubcategorias) {
            if (dadosSubcategorias.length > 0) {
                subcategoriasJSON.subcategorias = dadosSubcategorias
                subcategoriasJSON.quantidade = dadosSubcategorias.length
                subcategoriasJSON.status_code = 200

                return subcategoriasJSON
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

const getBuscarSubcategoria = async function (id) {

    let idSubcategoria = id

    try {

        if (idSubcategoria == undefined || isNaN(idSubcategoria) || idSubcategoria == "") {
            return message.ERROR_INVALID_ID
        } else {
            let subcategoriaJSON = {}

            let dadosSubcategoria = await subcategoriasDAO.selectSubcategoriaById(idSubcategoria)

            await Promise.all(dadosSubcategoria.map(async subcategoria =>{
                let categoriaResult = await categoriasDAO.selectCategoriaById(subcategoria.categoria)
                subcategoria.categoria = categoriaResult
            }))
    

            if (dadosSubcategoria) {
                if (dadosSubcategoria.length > 0) {
                    subcategoriaJSON.subcategoria = dadosSubcategoria
                    subcategoriaJSON.status_code = 200

                    return subcategoriaJSON
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

const getBuscarSubcategoriasByCategoria = async function (id){
    let idCategoria = id

    try {

        if (idCategoria == undefined || isNaN(idCategoria) || idCategoria == "") {
            return message.ERROR_INVALID_ID
        } else {
            let subcategoriasJSON = {}

            let dadosSubcategorias = await subcategoriasDAO.selectSubcategoriaByCategoria(idCategoria)

            if (dadosSubcategorias) {
                if (dadosSubcategorias.length > 0) {
                    subcategoriasJSON.subcategorias = dadosSubcategorias
                    subcategoriasJSON.status_code = 200

                    return subcategoriaJSON
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

const setInserirSubcategoria = async function (dadosBody, contentType) {

    let dadosSubcategoria = dadosBody

    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            let novaSubcategoriaJSON = {}

            if (dadosSubcategoria.nome == "" || dadosSubcategoria.nome == undefined || dadosSubcategoria.nome == null || dadosSubcategoria.nome.length > 45 ||
                dadosSubcategoria.categoria == "" || dadosSubcategoria.categoria == undefined || dadosSubcategoria.categoria == null || isNaN(dadosSubcategoria.categoria)) {
                return message.ERROR_REQUIRED_FIELDS
            } else {

                let novaSubcategoria = await subcategoriasDAO.insertSubcategoria(dadosBody)
                let novaSubcategoriaId = await subcategoriasDAO.selectLastInsertId()
                let dadosNovaSubcategoria = await getBuscarSubcategoria(novaSubcategoriaId)

                if (novaSubcategoria) {
                    novaSubcategoriaJSON.subcategoria = dadosNovaSubcategoria.subcategoria
                    novaSubcategoriaJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    novaSubcategoriaJSON.status = message.SUCCESS_CREATED_ITEM.status
                    novaSubcategoriaJSON.message = message.SUCCESS_CREATED_ITEM.message

                    return novaSubcategoriaJSON

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

const setAtualizarSubcategoria = async function (id, dadosBody, contentType) {

    let dadosSubcategoria = dadosBody
    let idSubcategoria = id

    
    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            if (idSubcategoria == undefined || isNaN(idSubcategoria) || idSubcategoria == "") {
                return message.ERROR_INVALID_ID
            } else {

                let subcategoriaAtualizadaJSON = {}

                if (dadosSubcategoria.nome == "" || dadosSubcategoria.nome == undefined || dadosSubcategoria.nome == null || dadosSubcategoria.nome.length > 45 ||
                    dadosSubcategoria.categoria == "" || dadosSubcategoria.categoria == undefined || dadosSubcategoria.categoria == null || isNaN(dadosSubcategoria.categoria)) {
                    return message.ERROR_REQUIRED_FIELDS
                } else {

                    let subcategoriaAtualizada = await subcategoriasDAO.updateSubcategoria(dadosBody, idSubcategoria)

                    let dadosSubcategoria = await getBuscarSubcategoria(idSubcategoria)

                    if (subcategoriaAtualizada) {
                        subcategoriaAtualizadaJSON.subcategoria = dadosSubcategoria.subcategoria
                        subcategoriaAtualizadaJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        subcategoriaAtualizadaJSON.status = message.SUCCESS_CREATED_ITEM.status
                        subcategoriaAtualizadaJSON.message = message.SUCCESS_CREATED_ITEM.message

                        return subcategoriaAtualizadaJSON

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

const setExcluirSubcategoria = async function (id) {

    let idSubcategoria = id

    try {

        if (idSubcategoria == undefined || isNaN(idSubcategoria) || idSubcategoria == "") {
            return message.ERROR_INVALID_ID
        } else {
            let subcategoriaExcluidaJSON = {}

            let dadosSubcategoriaExcluida = await subcategoriasDAO.deleteSubcategoria(idSubcategoria)

            if (dadosSubcategoriaExcluida) {
                subcategoriaExcluidaJSON.status_code = message.SUCCESS_DELETED_ITEM.status_code
                subcategoriaExcluidaJSON.status = message.SUCCESS_DELETED_ITEM.status
                subcategoriaExcluidaJSON.message = message.SUCCESS_DELETED_ITEM.message

                    return subcategoriaExcluidaJSON
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {

        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    getListarSubcategorias,
    getBuscarSubcategoria,
    setInserirSubcategoria,
    setAtualizarSubcategoria,
    setExcluirSubcategoria,
    getBuscarSubcategoriasByCategoria
}