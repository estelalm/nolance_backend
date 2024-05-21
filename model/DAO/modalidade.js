const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const selectAllModalidades = async ()=> {
    try {
        let sql = "select * from tbl_modalidade";
    
        let rsModalidade = await prisma.$queryRawUnsafe(sql);
    
        return rsModalidade;
    } catch (error) {
        return false
    }
}

const selectByIdModalidade = async (id) => {
    try {
        let sql = `select * from tbl_modalidade where id = ${id}`;
    
        let rsModalidade = await prisma.$queryRawUnsafe(sql);
    
        return rsModalidade;
    } catch (error) {
        return false
    }
}

const updateModalidade = async (dados, id) => {
    let sql;
    try {
          sql = `UPDATE tbl_modalidade
          SET
              nome = '${dados.nome}'
          WHERE id = ${id};`;
  
      let result = await prisma.$executeRawUnsafe(sql);
  
      if (result) return true;
      else return false;
  
    } catch (error) {
      return false;
    }
}

const deletar = async (id) => {
    try {
        let sql = `delete from tbl_modalidade where id = ${id}`;
    
        let rsDeletedModalidade = await prisma.$queryRawUnsafe(sql);
    
        return rsDeletedModalidade;
      } catch (error) {
        return false;
    }
}

module.exports = {
    selectAllModalidades,
    selectByIdModalidade,
    updateModalidade,
    deletar
}