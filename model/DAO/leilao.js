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

const selectLastId = async () => {
    try {
      let sql =
        "select cast(last_insert_id() as decimal) as id from tbl_leilao limit 1;";
  
      let id = await prisma.$queryRawUnsafe(sql);
  
      return id;
    } catch (error) {
      return false;
    }
  };

  const selectByIdLeilao = async (id) => {

    try {
        let sql = `select * from tbl_leilao where id = ${id}`;

        let rsLeilao = await prisma.$queryRawUnsafe(sql);
    
        return rsLeilao;
    } catch (error) {
        return false
    }
}

const insertNewLeilao = async (dados) => {
    try {
      let sql = `insert into tbl_leilao (nome, data_inicio, data_final, retirada, categoria_id, comitente_id, modalidade_id) values
                                        ('${dados.nome}','${dados.data_inicio}', '${dados.data_final}', '${dados.retirada}', ${dados.categoria_id}, ${dados.comitente_id}, ${dados.modalidade_id});`
                                        
        let result = await prisma.$executeRawUnsafe(sql)

        if(result) return true
        else return false

    } catch (error) {
        return false
    }
}

const atualizarLeilao = async (dados, id) => {

    try{
        let sql = `update tbl_leilao set
                  nome =  '${dados.nome}',
                  data_inicio = '${dados.data_inicio}',
                  data_final = '${dados.data_final}',
                  retirada = '${dados.retirada}',
                  categoria_id = ${dados.categoria_id},
                  comitente_id = ${dados.comitente_id},
                  modalidade_id = ${dados.modalidade_id}
                  where id = ${id}`

        let rsLeilao = await prisma.$executeRawUnsafe(sql)

        return rsLeilao
    }catch(error){
        return false
    }
}

const deletar = async (id) => {
    try {
        let sql = `delete from tbl_leilao where id = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result) return true
        else return false

    } catch (error) {
        return false
    }
}

module.exports = {
    selectAllLeiloes,
    insertNewLeilao,
    selectLastId,
    selectByIdLeilao,
    atualizarLeilao,
    deletar
}