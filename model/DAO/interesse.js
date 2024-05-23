const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

const selectAllInterests = async function() {

    try{
        let sql = `select * from tbl_interesse`

        let rsInteresse = await prisma.$queryRawUnsafe(sql)

        return rsInteresse

    }catch(error){

        return false
    }
}

const selectLastId = async () => {
    try {
      let sql =
        "select cast(last_insert_id() as decimal) as id from tbl_interesse limit 1;";
  
      let id = await prisma.$queryRawUnsafe(sql);
  
      return id;
    } catch (error) {
      return false;
    }
  };

  const selectInterestByUserId = async (idUser) => {
    try {
        let sql = `select * from tbl_interesse WHERE usuario_id = ${idUser}`

        let dados = await prisma.$queryRawUnsafe(sql);
  
        return dados;        
    } catch (error) {
        return false
    }
  }

  const selectInterestById = async (id) => {
    try {
        let sql = `select * from tbl_interesse WHERE id = ${id}`

        let dados = await prisma.$queryRawUnsafe(sql);
  
        return dados;        
    } catch (error) {
        return false
    }
  }

const insertNewInterest = async (idCategoria, idUsuario) => {

    try{
        let sql = `insert into tbl_interesse(categoria_id, usuario_id) values 
                    (${idCategoria}, ${idUsuario});`

        let rsInteresse = await prisma.$executeRawUnsafe(sql)

        return rsInteresse
    }catch(error){

        return false
    }
}

const deleteUserInterest = async (id) => {
    try {
        let sql = `delete from tbl_interesse where usuario_id = ${id}`;
    
        let rsDeletedInterest = await prisma.$queryRawUnsafe(sql);
    
        return rsDeletedInterest;
      } catch (error) {
        return false;
    }
}


module.exports = {
    selectAllInterests,
    insertNewInterest,
    selectLastId,
    selectInterestByUserId,
    selectInterestById,
    deleteUserInterest,
}