const message = require('../module/config.js')
const paymentsDAO = require('../model/DAO/pagamento.js')
const bidDAO = require('../model/DAO/lance.js')
const paymentsMeythodsDAO = require('../model/DAO/forma_pagamento.js')
const usersDAO = require('../model/DAO/usuario.js')
const enderecoDAO = require('../model/DAO/endereco.js')
const loteDAO = require('../model/DAO/lote.js')
const { createPayment } = require("../model/DAO/pagamento.js");
const stripe = require("../stripe.js");

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

const createPaymentIntent = async (arrematante, idLote) => {
    
    try {
        const dadosLote = await loteDAO.selectLoteById(idLote)
        const imagensLote = await loteDAO.selectImagemLote(idLote)
        dadosLote.imagens = imagensLote
     
        const result = await stripe.makePayment(arrematante.lance[0], dadosLote);
        
        return result;

    } catch (error) {
        console.log(error);
        return false
    }
};
  
const confirmPayment = async (order, sig) => {
    const pedido = JSON.parse(order.toString())

    try {
        const event = await stripe.handlePayment(order, sig);
         
        if (!event) return 

        if(order.lance_id == "" || order.lance_id == undefined|| order.lance_id == null || isNaN(order.lance_id) ||
        order.intent_payment_id == ""|| order.intent_payment_id == undefined || order.intent_payment_id == null ||
        order.tbl_forma_pagamento_id == "" || order.tbl_forma_pagamento_id == undefined|| order.tbl_forma_pagamento_id == null || isNaN(order.tbl_forma_pagamento_id) ||
        order.data_pagamento == "" || order.data_pagamento == undefined || order.data_pagamento == null || order.data_pagamento.length > 19
    ){
        return message.ERROR_REQUIRED_FIELDS
    } else {
  
        await createPayment(order, event.payment_intent);
        return { recieved: true };
    }
    } catch (error) {
        return false
    }
    
};



module.exports = {
    listAllPayments,
    createPaymentIntent,
    confirmPayment
}