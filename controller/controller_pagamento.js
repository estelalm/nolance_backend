const message = require('../module/config.js')
const paymentsDAO = require('../model/DAO/pagamento.js')
const bidDAO = require('../model/DAO/lance.js')
const paymentsMeythodsDAO = require('../model/DAO/forma_pagamento.js')
const usersDAO = require('../model/DAO/usuario.js')
const enderecoDAO = require('../model/DAO/endereco.js')

const listAllPayments = async () => {
    try {   
        let paymentsJSON = {}
        let paymentsArray = []

        let payments = await paymentsDAO.selectAllPayments()

        await Promise.all(payments.map(async item => {
            let bidData = await bidDAO.selectLanceById(item.lance_id)

            delete item.lance_id
            item.lance = bidData

            let paymentMethodData = await paymentsMeythodsDAO.selectPaymentMethodById(item.tbl_forma_pagamento_id)

            delete item.tbl_forma_pagamento_id
            item.forma_pagamento = paymentMethodData
         
            let userData = await usersDAO.selectByIdUser(bidData[0].usuario)

            delete userData[0].senha
            item.lance[0].usuario = userData

            let addressData = await enderecoDAO.selectByIdEndereco(userData[0].endereco_id)

            delete item.lance[0].usuario[0].endereco_id
            item.lance[0].usuario[0].endereco = addressData

            paymentsArray.push(item)

        }))
        
        paymentsJSON.pagamentos = paymentsArray
        paymentsJSON.quantidade = paymentsArray.length
        paymentsJSON.status_code = 200

        return paymentsJSON
    } catch (error) {
        return false
    }
}

const addPayment = async (dados, contentType) => {
    try {
        if(String(contentType).toLowerCase() == 'application/json'){
            let newPaymentJSON = {}

            if(dados.lance_id == "" || dados.lance_id == undefined|| dados.lance_id == null || isNaN(dados.lance_id) ||
                dados.tbl_forma_pagamento_id== "" || dados.tbl_forma_pagamento_id == undefined|| dados.tbl_forma_pagamento_id == null || isNaN(dados.tbl_forma_pagamento_id) ||
                dados.data_pagamento == "" || dados.data_pagamento == undefined || dados.data_pagamento == null || dados.data_pagamento.length > 19
            ){
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let newPayment = await paymentsDAO.insertPayment(dados)

                
            }
        }
    } catch (error) {
        return false
    }
}

module.exports = {
    listAllPayments
}