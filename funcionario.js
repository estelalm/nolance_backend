const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

const selectAllEmployees = async () => {
    try {
        let sql = `select * from tbl_funcionario`

        let rsEmployees = await prisma.$queryRawUnsafe(sql)

        return rsEmployees

    } catch (error) {

        return false
    }
}

const selectLastId = async () => {
    try {
        let sql =
            "select cast(last_insert_id() as decimal) as id from tbl_funcionario limit 1;";

        let id = await prisma.$queryRawUnsafe(sql);

        return id;
    } catch (error) {
        return false;
    }
}

const selectByIdEmployee = async (id) => {
    try {
        let sql = `select * from tbl_funcionario where id = ${id}`;
    
        let rsEmployee = await prisma.$queryRawUnsafe(sql);
    
        return rsEmployee;
    } catch (error) {
        return false
    }
}

const insertNewEmployee = async (dados) => {
    try {
        let sql = `INSERT INTO tbl_funcionario (nome, email, senha) values
                    ('${dados.nome}', '${dados.email}', '${dados.senha}');`

        let rsEmployee = await prisma.$executeRawUnsafe(sql)

        return rsEmployee
    } catch (error) {
        return false
    }
}

const updateEmployee = async (dados, id) => {
    let sql;
    try {
          sql = `UPDATE tbl_funcionario
          SET
              nome = '${dados.nome}', 
              email ='${dados.email}',
              senha = '${dados.senha}'
          WHERE id = ${id};`;

      let result = await prisma.$executeRawUnsafe(sql);
  
      if (result) return true;
      else return false;
  
    } catch (error) {
      return false;
    }
}

const deleteEmployee = async (id) => {
    let sql;
    try {
        sql = `DELETE from tbl_funcionario WHERE id = ${id};`  

        let rsdeletedEmployee = await prisma.$queryRawUnsafe(sql);
  
        return rsdeletedEmployee;
    } catch (error) {
        return false
    }
}

module.exports = {
    selectAllEmployees,
    insertNewEmployee,
    selectLastId,
    updateEmployee,
    selectByIdEmployee,
    deleteEmployee
}