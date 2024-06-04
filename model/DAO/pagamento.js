const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const selectAllPayments = async () => {
  try {
    let sql = `select * from tbl_pagamento`;

    let rsPayments = await prisma.$queryRawUnsafe(sql);

    return rsPayments;
  } catch (error) {
    return false;
  }
};

const createPayment = async (dados, intent_payment_id) => {
  try {
    let sql = `insert into tbl_pagamento (lance_id, intent_payment_id ,tbl_forma_pagamento_id, completado, data_pagamento ) values
                    (   ${dados.lance_id} ,
                         ${intent_payment_id}, 
                         ${dados.forma_pagamento_id}, 
                         false, 
                         '${dados.data_pagamento}')`;

    let result = await prisma.$executeRawUnsafe(sql);

    if (result) return true;
    else return false;
  } catch (error) {
    return false;
  }
};

const findByIntentPayment = async (intent_payment_id) => {
  try {
    let sql = `select * from tbl_pagamento where intent_payment_id = ${intent_payment_id}`;

    let result = await prisma.$queryRawUnsafe(sql);

    if (result) return true;
    else return false;
  } catch (error) {
    return false;
  }
};

const completePayment = async (dados, intent_payment_id) => {
  try {
    let sql = `UPDATE tbl_pagamento SET 
                    lance_id = ${dados.lance_id},
                    intent_payment_id = ${intent_payment_id},
                    tbl_forma_pagamento_id = ${dados.forma_pagamento_id},
                    completado = true,
                    data_pagamento = '${dados.data_pagamento}'
                WHERE intent_payment_id = ${intent_payment_id}  `;

    let result = await prisma.$executeRawUnsafe(sql);

    if (result) return true;
    else return false;
  } catch (error) {
    return false;
  }
};

module.exports = {
  selectAllPayments,
  completePayment,
  findByIntentPayment,
  createPayment,
};
