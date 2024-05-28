const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const selectAllPayments = async () => {
    try {
        let sql = `select * from tbl_pagamento`

        let rsPayments = await prisma.$queryRawUnsafe(sql)

        return rsPayments
    } catch (error) {
        return false
    }
}

const insertPayment = async (dados) => {
    try {
        let sql = `insert into tbl_pagamento (lance_id, tbl_forma_pagamento_id, data_pagamento) values
                (${dados.lance_id}, ${dados.tbl_forma_pagamento_id}, ${dados.data_pagamento})`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) return true
        else return false

    } catch (error) {
        return false
    }
}

module.exports = {
    selectAllPayments,
    insertPayment
}