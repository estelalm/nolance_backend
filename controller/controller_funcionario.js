const message = require('../module/config.js')

const employeesDAO = require('../model/DAO/funcionario.js')

const listEmployees = async () => {
    let employeesJSON = {}

    let employeesData = await employeesDAO.selectAllEmployees()

    if(employeesData){
        if(employeesData.length > 0){
            employeesJSON.funcionarios = employeesData
            employeesJSON.quantidade = employeesData.length
            employeesJSON.status_code = 200;

            return employeesJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const addEmployee = async (dados, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let newEmployeeJSON = {}

            if (dados.nome == '' || dados.nome == undefined || dados.nome == null || dados.nome.length > 100 ||
                dados.email == ''|| dados.email == undefined|| dados.email == null || dados.email.length > 45 ||
                dados.senha == '' || dados.senha == undefined || dados.senha == null || dados.senha.length >45 
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {

                let newEmployee = await employeesDAO.insertNewEmployee(dados)

                let id = await employeesDAO.selectLastId()

                if (newEmployee) {
                    dados.id = id[0].id
                    newEmployeeJSON.funcionario = dados
                    newEmployeeJSON.status = message.SUCCESS_CREATED_ITEM.status
                    newEmployeeJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    newEmployeeJSON.message = message.SUCCESS_CREATED_ITEM.message

                    return newEmployeeJSON
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB 
                }

            }
        } else {
            return message.ERROR_CONTENT_TYPE 
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const updateEmployee = async (dados, id , contentType) => {

    try {
        if(String(contentType).toLowerCase() == 'application/json'){
            let updateEmployeeJSON = {}

            if(id == '' || id == undefined || isNaN(id) || 
                dados.nome == '' || dados.nome == undefined || dados.nome == null || dados.nome.length > 100 ||
                dados.email == ''|| dados.email == undefined|| dados.email == null || dados.email.length > 45 ||
                dados.senha == '' || dados.senha == undefined || dados.senha == null || dados.senha.length >45 )
                {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let employeeId = await employeesDAO.selectByIdEmployee(id)

                if (employeeId.length > 0) {
                    let updatedEmployee = await employeesDAO.updateEmployee(dados, id)
                    if (updatedEmployee) {
                        updateEmployeeJSON.funcionarioAtualizado = dados
                        updatedEmployee.status = message.SUCCESS_UPDATED_ITEM.status
                        updateEmployeeJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        updateEmployeeJSON.message = message.SUCCESS_UPDATED_ITEM.message

                        return message.SUCCESS_UPDATED_ITEM
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB //500
                    }

                } else {
                    return message.ERROR_NOT_FOUND
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const deleteEmployee = async (id) => {
    try {
        let employeeId = id

        if (employeeId == '' || employeeId == undefined || isNaN(employeeId)) {
            return message.ERROR_INVALID_ID
        } else {
            let employee = await employeesDAO.selectByIdEmployee(employeeId)

            if (employee.length > 0) {
                let deletedEmployee = await employeesDAO.deleteEmployee(employeeId)
                if (deletedEmployee) {
                    return message.SUCCESS_DELETED_ITEM
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            } else {
                return message.ERROR_NOT_FOUND
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports ={
    listEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
}