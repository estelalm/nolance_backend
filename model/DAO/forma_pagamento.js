const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const selectAllPaymentsMethods = async () => {
    try {
        let sql = `select * from tbl_forma_pagamento`

        let rsMethods = await prisma.$queryRawUnsafe(sql)

        return rsMethods
    } catch (error) {
        return false
    }
}

const selectPaymentMethodById = async (id) => {
    try {
        let sql = `select * from tbl_forma_pagamento where id = ${id}`
        
        let rsMethod = await prisma.$queryRawUnsafe(sql)

        return rsMethod
    } catch (error) {
        return false
    }
}

module.exports = {
    selectAllPaymentsMethods,
    selectPaymentMethodById
}