const inquirer=require("inquirer");
const connection=require("./connection.js");
const db=require("./db.js");
const cTable=require("console.table");
const managers=[];
const roles=[];
const departments=[];


function init(){
    
  // Initiate MySQL Connection.
  connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
    mainMenu();
  });
}

function mainMenu(){
    inquirer.prompt({
        message:"Main Menu",
        name:"menuChoice",
        type:"list",
        choices:["Add Employee", "Add Department", "Add Role","Exit"]
    }) .then(answers=>{
        switch(answers.menuChoice){
            case "Add Department":
                addDepartment();
            break;
            case "Add Employee":
                db.loadManagers(addEmployeeRoles);
            break;
            case "Add Role":
                db.loadDepts(addRolePrompt);    
            break;
            case "View All Employees":
                db.loadEmployees(showEmployees);
            break;

            case "Exit":
            process.exit();
        }
    });
}

function showEmployees(employeeArray){
    cTable(employeeArray);
    mainMenu();
}

// function addEmployeeManagers(){
//     db.loadManagers(addEmployeeRoles);
// }
function addEmployeeRoles(managers){
    db.loadRoles(addEmployeePrompt, managers);
}
// function addRoleDepartments(){
//     db.loadDepts(addRolePrompt);    
// }
function addRolePrompt(depts){
    let dChoice=[];
    for(d of depts){
        dChoice.push({name:d.name, value:d.id});
    }
    inquirer.prompt([
        {
            message:"Please enter the role title:",
            type:"input",
            name:"title",
            validate:function(value){if(value.length>0)return true; else return "Please enter a string.";}
        },
        {
            message:"Please choose the affiliated department.",
            type:"list",
            name:"deptChoice",
            choices:dChoice
        },
        {
            message:"Please the salary:",
            type:"input",
            name:"salary",
            validate:function(value){console.log(parseInt(value)); if(isNaN(parseInt(value))) return "Please enter numerical digits only."; else return true;}
        }
    ])
    .then(function(answers){
        db.addRoleInfo(answers, mainMenu);
    });
}



function addDepartment(){
    inquirer.prompt(
        {
            message:"Please enter a name for this new department:",
            name:"deptName",
            type:"input",
            validate:function(value){if(value.length>0)return true; else return "Please enter a string.";}
        }
    ) .then(function(answers){
        db.addDepartmentInfo(answers, mainMenu);
    });
}

function addEmployeePrompt(managers, roles){
    // We get an array of manager objects and an array of role objects

    const mChoice=[];
    const rChoice=[];
    for(m of managers){
        let test={};
        test.value=m.id;
        test.name=m.first_name+" "+m.last_name+", Manager of "+m.name,
        mChoice.push(test);
    }
    for(r of roles){
        let test={};
        test.value=r.id;
        test.name=r.title+", "+r.name+" Department",
        rChoice.push(test);
    }    
    if(mChoice.length===0) mChoice.push("No manager assigned");
    inquirer.prompt([
        {
            message:"Employee first name: ",
            name:"firstName",
            type:"input",
            validate:function(value){if(value.length>0)return true; else return "Please enter a string."}
        },       
        {
            message:"Employee Last name: ",
            name:"lastName",
            type:"input",
            validate:function(value){if(value.length>0)return true; else return "Please enter a string.";}
        },       
        {
            message:"Employee role: ",
            name:"roleChoice",
            type:"list",
            choices:rChoice
        },       
        {
            message:"Employee manager: ",
            name:"managerChoice",
            type:"list",
            choices:mChoice
        }
 
    ]).then(
        (answers)=>{
            db.addEmployeeInfo(answers, mainMenu);
        }
    )
}
init();