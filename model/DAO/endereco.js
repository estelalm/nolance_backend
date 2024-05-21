const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const selectAllAddress = async ()=> {
    try {
        let sql = "select * from tbl_endereco";
    
        let rsEndereco = await prisma.$queryRawUnsafe(sql);
    
        return rsEndereco;
    } catch (error) {
        return false
    }
}

const selectByIdEndereco = async (id) => {
    try {
        let sql = `select * from tbl_endereco where id = ${id}`;
    
        let rsEndereco = await prisma.$queryRawUnsafe(sql);
    
        return rsEndereco;
    } catch (error) {
        return false
    }
}

const selectLastId = async () => {
    try {
      let sql =
        "select cast(last_insert_id() as decimal) as id from tbl_endereco limit 1;";
  
      let id = await prisma.$queryRawUnsafe(sql);
  
      return id;
    } catch (error) {
      return false;
    }
  };

const updateEndereco = async (dados, id) => {
    let sql;
    try {
          sql = `UPDATE tbl_endereco
          SET
              cep = '${dados.cep}', 
              numero ='${dados.numero}'
          WHERE id = ${id};`;
  
      let result = await prisma.$executeRawUnsafe(sql);
  
      if (result) return true;
      else return false;
  
    } catch (error) {
      return false;
    }
}

const insertEndereco = async (dados) => {
    let sql;
    try {
        sql = `insert into tbl_endereco (  cep,
                                                  numero
              ) values (
                                                  '${dados.cep}',
                                                  '${dados.numero}'
    );`

      let result = await prisma.$executeRawUnsafe(sql);

      if (result) return true;
      else return false;

    } catch (error) {
      return false;
    }
}


const deletar = async (id) => {
  try {
      let sql = `delete from tbl_endereco where id = ${id}`;
  
      let rsDeletedEndereco = await prisma.$queryRawUnsafe(sql);
  
      return rsDeletedEndereco;
    } catch (error) {
      return false;
  }
}


module.exports ={
    selectAllAddress,
    selectByIdEndereco,
    updateEndereco,
    insertEndereco,
    selectLastId,
    deletar
}