const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

const selectAllUsers = async () => {
    try {
        let sql = `select * from tbl_usuario`

        let rsUsers = await prisma.$queryRawUnsafe(sql)

        return rsUsers

    } catch (error) {

        return false
    }
}

const selectLastId = async () => {
    try {
        let sql =
            "select cast(last_insert_id() as decimal) as id from tbl_usuario limit 1;";

        let id = await prisma.$queryRawUnsafe(sql);

        return id;
    } catch (error) {
        return false;
    }
}

const selectByIdUser = async (id) => {
    try {
        let sql = `select * from tbl_usuario where id = ${id}`;
    
        let rsUser = await prisma.$queryRawUnsafe(sql);
    
        return rsUser;
    } catch (error) {
        return false
    }
}

const selectByLoginUser = async (email, senha) => {
    try {
        let sql = `select * from tbl_usuario where email = '${email}' and senha = '${senha}'`;
    
        let rsUser = await prisma.$queryRawUnsafe(sql);
    
        return rsUser;
    } catch (error) {
        console.log(error)
        return false
    }
}

const insertNewUser = async (dados) => {
    try {
        let sql = `INSERT INTO tbl_usuario (nome, email, senha, telefone, icone, data_nascimento, cpf, endereco_id) values
                    ('${dados.nome}', '${dados.email}', '${dados.senha}', '${dados.telefone}', '${dados.icone}', '${dados.data_nascimento}', '${dados.cpf}', ${dados.endereco_id});`

        let rsUser = await prisma.$executeRawUnsafe(sql)

        return rsUser
    } catch (error) {
        return false
    }
}

const updateUser = async (dados, id) => {
    let sql;
    try {
          sql = `UPDATE tbl_usuario
          SET
              nome = '${dados.nome}', 
              email ='${dados.email}',
              senha = '${dados.senha}',
              telefone = '${dados.telefone}',
              icone = '${dados.icone}',
              data_nascimento = '${dados.data_nascimento}',
              cpf = '${dados.cpf}',
              endereco_id = ${dados.endereco_id}
          WHERE id = ${id};`;

      let result = await prisma.$executeRawUnsafe(sql);
  
      if (result) return true;
      else return false;
  
    } catch (error) {
      return false;
    }
}

const deleteUser = async (id) => {
    let sql;
    try {
        sql = `DELETE from tbl_usuario WHERE id = ${id}`  

        let rsdeletedUser = await prisma.$queryRawUnsafe(sql);
  
        return rsdeletedUser;
    } catch (error) {
        return false
    }
}

module.exports = {
    selectAllUsers,
    selectByLoginUser,
    insertNewUser,
    selectLastId,
    updateUser,
    selectByIdUser,
    deleteUser
}