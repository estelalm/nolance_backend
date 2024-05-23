/*********************************************************************************************
 * Objetivo: Criação de um API para manipular dados de uma empresa de leilão online
 * Data: 21/05/2024
 * Autor: Maria Luiza Gomes de Almeida e Estela Alves
 * Versão: 1.0
*********************************************************************************************/

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {request} = require('http')

const app = express()
app.use(express.json())

app.use((request, response, next) =>{
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())

    next()
})

/*********************Import dos arquivos de controller do projeto*************************/
const controllerStatus = require('./controller/controller_status.js')
const controllerModalidade = require('./controller/controller_modalidade.js')
const controllerEndereco = require('./controller/controller_endereco.js')
const controllerSubcategorias = require('./controller/controller_subcategoria.js')
const controllerCategorias = require('./controller/controller_categoria.js')
const { log } = require('console')
/******************************************************************************************/

const bodyParserJSON = bodyParser.json()

/* STATUS - CRUD */

app.get('/v1/nolance/status', cors(), async function(request, response){
    let dados = await controllerStatus.getListarStatus()

    response.status(dados.status_code)
    response.json(dados)
})

app.put('/v1/nolance/status/:id', cors(), async function(request, response){
    let contentType = request.header('content-type')

    let id = request.params.id

    let dadosBody = request.body

    let resultDadosAtualizados = await controllerStatus.atualizarStatus(dadosBody, id, contentType )

    response.status(resultDadosAtualizados.status_code)
    response.json(resultDadosAtualizados)
})

app.delete('/v1/nolance/status/:id', cors(), async function(request, response){
    let id = request.params.id

    let statusExcluido = await controllerStatus.deletarStatus(id)

    response.status(statusExcluido.status_code)
    response.json(statusExcluido)
})

/* MODALIDADE - CRUD */

app.get('/v1/nolance/modalidade', cors(), async function(request, response){
    let dados = await controllerModalidade.listarTodasModalidades()

    response.status(dados.status_code)
    response.json(dados)
})

app.put('/v1/nolance/modalidade/:id', cors(), async function(request,response){
    let contentType = request.header('content-type')

    let id = request.params.id

    let dadosBody = request.body

    let resultDadosAtualizados = await controllerModalidade.atualizarModalidade(dadosBody, id, contentType )

    response.status(resultDadosAtualizados.status_code)
    response.json(resultDadosAtualizados)
})

app.delete('/v1/nolance/modalidade/:id', cors(), async function(request,response){
    let id = request.params.id

    let modalidadeExcluida = await controllerModalidade.deletarModalidade(id)

    response.status(modalidadeExcluida.status_code)
    response.json(modalidadeExcluida)
})

/* ENDEREÇO - CRUD */
app.get('/v1/nolance/endereco', cors(), async function(request, response){
    let dados = await controllerEndereco.getListarEnderecos()

    response.status(dados.status_code)
    response.json(dados)
})

app.put('/v1/nolance/endereco/:id', cors(), async function(request, response){
    let contentType = request.header('content-type')

    let id = request.params.id

    let dadosBody = request.body

    let resultDadosAtualizados = await controllerEndereco.atualizarEndereco(dadosBody, id, contentType )

    response.status(resultDadosAtualizados.status_code)
    response.json(resultDadosAtualizados)
})

app.post('/v1/nolance/endereco', cors(), async function (request, response){
    let contentType = request.header('content-type')

    let dadosBody = request.body

    let resultDadosNovoEndereco = await controllerEndereco.adicionarEndereco(dadosBody, contentType)

    response.status(resultDadosNovoEndereco.status_code)
    response.json(resultDadosNovoEndereco)
})

app.delete('/v1/nolance/endereco/:id', cors(), async function(request,response){
    let id = request.params.id

    let enderecoExcluido = await controllerEndereco.deletarEndereco(id)

    response.status(enderecoExcluido.status_code)
    response.json(enderecoExcluido)
})

//Endpoints: categorias
app.get('/v1/nolance/categorias', cors(), async (request, response, next) =>{

    let dadosCategorias = await controllerCategorias.getListarCategorias()

    response.status(dadosCategorias.status_code)
    response.json(dadosCategorias)

    next()

})

app.get('/v1/nolance/categoria/:id', cors(), async (request, response, next) =>{

    let idCategoria = request.params.id

    let dadosCategorias = await controllerCategorias.getBuscarCategoria(idCategoria)

    response.status(dadosCategorias.status_code)
    response.json(dadosCategorias)

    next()

})


app.post('/v1/nolance/categoria', cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.header('content-type')
    let dadosBody = request.body
   

    let resultDadosCategoria = await controllerCategorias.setInserirCategoria(dadosBody, contentType)

    response.status(resultDadosCategoria.status_code)
    response.json(resultDadosCategoria)

})

app.put('/v1/nolance/categoria/:id', cors(), bodyParserJSON, async (request, response, next) =>{

    let idCategoria = request.params.id

    let contentType = request.header('content-type')
    let dadosBody = request.body
   

    let resultDadosCategoria = await controllerCategorias.setAtualizarCategoria(idCategoria, dadosBody, contentType)

    response.status(resultDadosCategoria.status_code)
    response.json(resultDadosCategoria)

})

app.delete('/v1/nolance/categoria/:id', cors(), async (request, response, next) =>{

    let idCategoria = request.params.id

    let dadosCategorias = await controllerCategorias.setExcluirCategoria(idCategoria)

    response.status(dadosCategorias.status_code)
    response.json(dadosCategorias)


})


//Endpoints: subcategorias
app.get('/v1/nolance/subcategorias', cors(), async (request, response, next) =>{

    let dadosSubcategorias = await controllerSubcategorias.getListarSubcategorias()

    response.status(dadosSubcategorias.status_code)
    response.json(dadosSubcategorias)

    next()

})

app.get('/v1/nolance/subcategoria/:id', cors(), async (request, response, next) =>{

    let idSubcategoria = request.params.id

    let dadosSubcategorias = await controllerSubcategorias.getBuscarSubcategoria(idSubcategoria)

    response.status(dadosSubcategorias.status_code)
    response.json(dadosSubcategorias)

    next()

})

app.post('/v1/nolance/subcategoria', cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.header('content-type')
    let dadosBody = request.body
   

    let resultDadosSubcategoria = await controllerSubcategorias.setInserirSubcategoria(dadosBody, contentType)

    response.status(resultDadosSubcategoria.status_code)
    response.json(resultDadosSubcategoria)

})

app.put('/v1/nolance/subcategoria/:id', cors(), bodyParserJSON, async (request, response, next) =>{

    let idSubcategoria = request.params.id

    let contentType = request.header('content-type')
    let dadosBody = request.body
   

    let resultDadosSubcategoria = await controllerSubcategorias.setAtualizarSubcategoria(idSubcategoria, dadosBody, contentType)

    response.status(resultDadosSubcategoria.status_code)
    response.json(resultDadosSubcategoria)

})

app.delete('/v1/nolance/subcategoria/:id', cors(), async (request, response, next) =>{

    let idSubcategoria = request.params.id

    let dadosSubcategorias = await controllerSubcategorias.setExcluirSubcategoria(idSubcategoria)

    response.status(dadosSubcategorias.status_code)
    response.json(dadosSubcategorias)

})



app.listen('8080', function(){
    console.log('API funcionando!')
})