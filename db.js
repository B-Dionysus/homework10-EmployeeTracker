const connection=require("./connection.js");


// Calls callback() with an array of every manager's first name, last name, department name, and id.
function loadManagers(callback){

    // Get a list of every employee that has a role_id that is a manager role
    let meSpeakWithAManager="select employee.first_name, employee.last_name, employee.id, department.name from employee join role ON role.id=employee.id and role.title='manager' join department on role.department_id=department.id;";
    connection.query(meSpeakWithAManager, function(err, result) {
        if(err) console.log(err);
        else{
            callback(result);
        }
    });
}
function loadDepts(callback){
    let meSpeakWithAManager="select employee.first_name, employee.last_name, employee.id, department.name from employee join role ON role.id=employee.id and role.title='manager' join department on role.department_id=department.id;";
    connection.query("select * from department", function(err, result) {
        if(err) console.log(err);
        else{
            callback(result);
        }
    });
}

// Calls callback() with an array containing every role id, role title, and the department name associated with that role
// As well as an array that was passed in, if there was one.
function loadRoles(callback, prevArray=[]){
    
    connection.query("select role.id, role.title, department.name from role join department on role.department_id=department.id;", function(err, result) {
        if(err) console.log("LoadRoles: "+err);
        else{
            if(result.length===0){
                console.log("Please enter at least one role.");
                // Does this work? I wonder if this works....
                mainMenu();
            }
            else callback(prevArray, result);
        }
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
function loadEmployees(callback){
    let sql="select employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary from employee join role on role.id=employee.role_id join department on department.id=role.department_id order by employee.last_name;";
    connection.query(sql,function(err, res){
        if(err) console.log("Load employees error: "+err);
        else callback(res);
    });  
}

module.exports={
    loadManagers,
    loadRoles,
    addEmployeeInfo,
    addDepartmentInfo,
    loadDepts,
    addRoleInfo,
    loadEmployees
}