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

const createPayment = async (dados, intent_payment_id, data_pagamento) => {
  try {
    let forma_pagamento_id = Number(dados.forma_pagamento_id)

    let sql = `insert into tbl_pagamento (lance_id, intent_payment_id ,tbl_forma_pagamento_id, completado, data_pagamento ) values
                    (   ${dados.customer.metadata.lanceId} ,
                        '${intent_payment_id}', 
                         ${forma_pagamento_id}, 
                         true, 
                         '${data_pagamento}');`;

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


module.exports = {
  selectAllPayments,
  findByIntentPayment,
  createPayment,
};
