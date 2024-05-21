const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const selectAllStatus = async ()=> {
    try {
        let sql = "select * from tbl_status";
    
        let rsStatus = await prisma.$queryRawUnsafe(sql);
    
        return rsStatus;
    } catch (error) {
        return false
    }
}

const selectByIdStatus = async (id) => {
    try {
        let sql = `select * from tbl_status where id = ${id}`;
    
        let rsStatus = await prisma.$queryRawUnsafe(sql);
    
        return rsStatus;
    } catch (error) {
        return false
    }
}

const updateStatus = async (dados, id) => {
    let sql;
    try {
          sql = `UPDATE tbl_status
          SET
              nome = '${dados.nome}', 
              cor ='${dados.cor}'
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
        let sql = `delete from tbl_status where id = ${id}`;
    
        let rsDeletedStatus = await prisma.$queryRawUnsafe(sql);
    
        return rsDeletedStatus;
      } catch (error) {
        return false;
    }
}

module.exports ={
    selectAllStatus,
    selectByIdStatus,
    updateStatus,
    deletar
}