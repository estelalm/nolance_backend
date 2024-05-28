const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const selectAllLeiloes = async () => {
    try {
        let sql = 'select * from tbl_leilao;'

        let rsLeiloes = await prisma.$queryRawUnsafe(sql)

        return rsLeiloes

    } catch (error) {
        return error
    }
}

module.exports = {
    selectAllLeiloes
}