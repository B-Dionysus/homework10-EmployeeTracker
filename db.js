const connection=require("./connection.js");



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

function loadRoles(callback, prevArray){

    // Get a list of every employee that has a role_id that is a manager role
    connection.query("select role.id, role.title, department.name from role join department on role.department_id=department.id;", function(err, result) {
        if(err) console.log("LoadRoles: "+err);
        else{
            if(result.length===0){
                console.log("Please enter at least one role before creating employees.");
                // Does this work? I wonder if this works....
                mainMenu();
            }
            else callback(prevArray, result);
        }
    });
}
function addEmployeeInfo(obj, callback){
    console.log(obj);
    connection.query("INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);", [obj.firstName, obj.lastName, obj.roleChoice, obj.managerChoice],function(err, res){
        if(err) console.log("Add employee SQL error: "+err);
        else callback();
    });
}



module.exports={
    loadManagers,
    loadRoles,
    addEmployeeInfo
}