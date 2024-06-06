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
    try {
        const event = await stripe.handlePayment(order, sig);
        if (!event) return;

        const { lanceId, paymentMethod, currentDateTimeFormatted } = extractPaymentInfo(event);

        if (isMissingRequiredFields(lanceId, paymentMethod, currentDateTimeFormatted)) {
            return message.ERROR_REQUIRED_FIELDS;
        }

        const paymentMethodId = getPaymentMethodId(paymentMethod);
        if (paymentMethodId === null) {
            return message.ERROR_INVALID_PAYMENT_METHOD_ID;
        } else{
            event.forma_pagamento_id = paymentMethodId
        }

        const payment = await createPayment(event, event.paymentIntentSucceeded.payment_intent, currentDateTimeFormatted);
        return { received: true, pagamento: payment };
    } catch (error) {
       
        return false;
    }
};

const extractPaymentInfo = (event) => {
    const lanceId = Number(event.customer.metadata.lanceId);
    const paymentMethod = event.paymentIntentSucceeded.payment_method_types[0];
    const currentDateTime = new Date();
    const currentDateTimeFormatted = currentDateTime.toISOString().replace('T',' ').slice(0, 19);

    return { lanceId, paymentMethod, currentDateTimeFormatted };
};

const isMissingRequiredFields = (lanceId, paymentMethod, currentDateTimeFormatted) => {
    return (
        lanceId === "" || lanceId === undefined || lanceId === null || isNaN(lanceId) ||
        paymentMethod === "" || paymentMethod === undefined || paymentMethod === null ||
        currentDateTimeFormatted === "" || currentDateTimeFormatted === undefined || currentDateTimeFormatted === null || currentDateTimeFormatted > 19
    );
};

const getPaymentMethodId = (paymentMethod) => {
    if (paymentMethod === "card") {
        return 1;
    }
    return null;
};

module.exports = {
    listAllPayments,
    createPaymentIntent,
    confirmPayment
}