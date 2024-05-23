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

console.log('lol')

app.listen('8080', function(){
    console.log('API funcionando!')
})