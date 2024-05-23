/***********************************************************************
 * Objetivo: Arquivo responsável pelas validações e consistências de dados de 'categorias'.
 * Data: 21/05/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/

const categoriasDAO = require('../model/DAO/categorias.js')
const subcategoriasDAO = require('../model/DAO/subcategorias.js')
const message = require('../module/config.js')

const getListarCategorias = async function () {

    try {

        let categoriasJSON = {}

        let dadosCategorias = await categoriasDAO.selectAllCategorias()

        await Promise.all(dadosCategorias.map(async categoria =>{
            let subcategoria = await subcategoriasDAO.selectSubcategoriaByCategoria(categoria.id)
            categoria.subcategorias = subcategoria
        }))

        if (dadosCategorias) {
            if (dadosCategorias.length > 0) {
                categoriasJSON.categorias = dadosCategorias
                categoriasJSON.quantidade = dadosCategorias.length
                categoriasJSON.status_code = 200

                return categoriasJSON
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

const getBuscarCategoria = async function (id) {

    let idCategoria = id

    try {

        if (idCategoria == undefined || isNaN(idCategoria) || idCategoria == "") {
            return message.ERROR_INVALID_ID
        } else {
            let categoriaJSON = {}

            let dadosCategoria = await categoriasDAO.selectCategoriaById(idCategoria)

            await Promise.all(dadosCategoria.map(async categoria =>{
                let subcategoria = await subcategoriasDAO.selectSubcategoriaByCategoria(categoria.id)
                categoria.subcategorias = subcategoria
            }))

            if (dadosCategoria) {
                if (dadosCategoria.length > 0) {
                    categoriaJSON.categoria = dadosCategoria
                    categoriaJSON.status_code = 200

                    return categoriaJSON
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


const setInserirCategoria = async function (dadosBody, contentType) {

    let dadosCategoria = dadosBody

    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            let novaCategoriaJSON = {}

            if (dadosCategoria.nome == "" || dadosCategoria.nome == undefined || dadosCategoria.nome == null || dadosCategoria.nome.length > 45 ||
                dadosCategoria.icone == "" || dadosCategoria.icone == undefined || dadosCategoria.icone == null || dadosCategoria.icone.length > 200 ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {

                let novaCategoria = await categoriasDAO.insertCategoria(dadosBody)
                let novaCategoriaId = await categoriasDAO.selectLastInsertId()
                let dadosNovaCategoria = await getBuscarCategoria(novaCategoriaId)

                if (novaCategoria) {
                    novaCategoriaJSON.categoria = dadosNovaCategoria.categoria
                    novaCategoriaJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    novaCategoriaJSON.status = message.SUCCESS_CREATED_ITEM.status
                    novaCategoriaJSON.message = message.SUCCESS_CREATED_ITEM.message

                    return novaCategoriaJSON

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

const setAtualizarCategoria = async function (id, dadosBody, contentType) {

    let dadosCategoria = dadosBody
    let idCategoria = id

    
    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            if (idCategoria == undefined || isNaN(idCategoria) || idCategoria == "") {
                return message.ERROR_INVALID_ID
            } else {

                let categoriaAtualizadaJSON = {}

                if (dadosCategoria.nome == "" || dadosCategoria.nome == undefined || dadosCategoria.nome == null || dadosCategoria.nome.length > 45 ||
                    dadosCategoria.icone == "" || dadosCategoria.icone == undefined || dadosCategoria.icone == null || dadosCategoria.icone.length > 200 ) {

                    return message.ERROR_REQUIRED_FIELDS
                } else {

                    let categoriaAtualizada = await categoriasDAO.updateCategoria(dadosBody, idCategoria)

                    let dadosCategoria = await getBuscarCategoria(idCategoria)

                    if (categoriaAtualizada) {
                        categoriaAtualizadaJSON.categoria = dadosCategoria.categoria
                        categoriaAtualizadaJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        categoriaAtualizadaJSON.status = message.SUCCESS_UPDATED_ITEM.status
                        categoriaAtualizadaJSON.message = message.SUCCESS_UPDATED_ITEM.message

                        return categoriaAtualizadaJSON

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

const setExcluirCategoria = async function (id) {

    let idCategoria = id

    try {

        if (idCategoria == undefined || isNaN(idCategoria) || idCategoria == "") {
            return message.ERROR_INVALID_ID
        } else {
            let categoriaExcluidaJSON = {}

            let dadosCategoriaExcluida = await categoriasDAO.deleteCategoria(idCategoria)

            if (dadosCategoriaExcluida) {
                categoriaExcluidaJSON.status_code = message.SUCCESS_DELETED_ITEM.status_code
                categoriaExcluidaJSON.status = message.SUCCESS_DELETED_ITEM.status
                categoriaExcluidaJSON.message = message.SUCCESS_DELETED_ITEM.message

                    return categoriaExcluidaJSON
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {

        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    getListarCategorias,
    getBuscarCategoria,
    setInserirCategoria,
    setAtualizarCategoria,
    setExcluirCategoria
}