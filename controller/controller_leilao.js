const message = require('../module/config.js')
const leiloesDAO = require('../model/DAO/leilao.js')
const categoriasDAO = require('../model/DAO/categoria.js')
const modalidadesDAO = require('../model/DAO/modalidade.js')
const comitentesDAO = require('../model/DAO/comitente.js')

const listLeiloes = async function () {
    try {
        let leiloesJSON = {}
        let leiloesArray = []

        let dadosLeiloes = await leiloesDAO.selectAllLeiloes()

        console.log(dadosLeiloes);
        
        for (let i = 0; i < dadosLeiloes.length; i++) {
            const leilao = dadosLeiloes[i];

            let dadosCategoria = await categoriasDAO.selectCategoriaById(leilao.categoria_id)

            let dadosModalidade = await modalidadesDAO.selectByIdModalidade(leilao.modalidade_id)

            let dadosComitente = await comitentesDAO.selectComitenteById(leilao.comitente_id)

            delete leilao.categoria_id
            leilao.categoria = dadosCategoria

            delete leilao.modalidade_id
            leilao.modalidade = dadosModalidade

            delete leilao.comitente_id
            leilao.comitente = dadosComitente

            leiloesArray.push(leilao)  

        }

        leiloesJSON.leiloes = leiloesArray
        leiloesJSON.quantidade = leiloesArray.length
        leiloesJSON.status_code = 200

        return leiloesJSON
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports ={
    listLeiloes
}