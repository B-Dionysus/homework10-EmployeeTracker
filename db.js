const connection=require("./connection.js");

// Note: I've left some comments in here, but mostly this is a pretty self-explanatory ORM. For a full overview of the
// flow and logic of the app, please review the comments in app.js.


// Calls callback() with an array of every manager's first name, last name, department name, and id.
function loadManagers(callback, id=""){

    // Get a list of every employee that has a role_id that is a manager role--i.e., all of the managers
    let meSpeakWithAManager="select employee.first_name, employee.last_name, employee.id, department.name from employee join role ON role.id=employee.role_id and role.title='manager' join department on role.department_id=department.id;";
    connection.query(meSpeakWithAManager, function(err, result) {
        if(err) console.log(err);
        else{
            if(id) callback(result, id);
            else callback(result);
        }
    });
}
function loadDepts(callback){
    connection.query("select id as ID, name as Department from department", function(err, result) {
        if(err) console.log(err);
        else{
            callback(result);
        }
    });
}

// Calls callback() with an array containing every role id, role title, and the department name associated with that role
// As well as an array that was passed in, if there was one.
function loadRoles(callback, prevArray=[]){
    
    connection.query("select role.id as ID, role.title as Position, department.name as Department from role join department on role.department_id=department.id;", function(err, result) {
        if(err) console.log("LoadRoles: "+err);
        else callback(result, prevArray);        
    });
}
function addEmployeeInfo(obj, callback){
    connection.query("INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);", [obj.firstName, obj.lastName, obj.roleChoice, obj.managerChoice],function(err, res){
        if(err) console.log("Add employee SQL error: "+err);
        else {
            callback();
        }
    });
}
function addDepartmentInfo(obj, callback){
    connection.query("INSERT into department (name) VALUES (?);", [obj.deptName],function(err, res){
        if(err) console.log("Add dept SQL error: "+err);
        else callback();
    });  
}
function addRoleInfo(obj, callback){
    connection.query("INSERT into role (title, salary, department_id) VALUES (?, ?, ?);", [obj.title, obj.salary, obj.deptChoice],function(err, res){
        if(err) console.log("Add dept SQL error: "+err);
        else callback();
    });  
}
function loadEmployees(callback, managerId=false){
    let byManager="";
    if(managerId) byManager="employee.manager_id="+managerId+" and ";
    let sql="select employee.id as ID, employee.first_name as 'First Name', employee.last_name as 'Last Name', role.title as Position, department.name as Department, role.salary as Salary from employee join role on "+byManager+"role.id=employee.role_id join department on department.id=role.department_id order by employee.last_name;";
    connection.query(sql,function(err, res){
        if(err) console.log("Load employees error: "+err);
        else callback(res);
    });  
}
function updateEmployeeInfo(col, newId, empId, callback){
    let q=connection.query("update employee set ??=? where id=?", [col, newId, empId],function(err, res){
    if(err) console.log("Update Role SQL error: "+err);
        else{
             callback();
        }
    }); 
}

function loadBudgets(callback){
    let query="select department.name as Department, SUM(salary) as Expenditures from role join employee on employee.role_id=role.id join department on role.department_id=department.id group by role.department_id;"; 
    connection.query(query,function(err, res){
    if(err) console.log("Update Role SQL error: "+err);
    else{
        callback(res);
    }
    }); 
}


module.exports={
    loadManagers,
    loadRoles,
    addEmployeeInfo,
    addDepartmentInfo,
    loadDepts,
    addRoleInfo,
    loadEmployees,
    updateEmployeeInfo,
    loadBudgets
}