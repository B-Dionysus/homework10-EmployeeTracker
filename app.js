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
    console.log("connected as id " + connection.threadId+"\n\n");
    
    console.clear();
    mainMenu();
  });
}

function mainMenu(){
    inquirer.prompt({
        message:"Main Menu",
        name:"menuChoice",
        type:"list",
        choices:["Add Employee", "Add Department", "Add Role","Update Employee Role", "View All Roles","View All Departments","View Employees by Manager", "View All Employees", "Exit"]
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
            case "View All Roles":
                db.loadRoles(showDepts);
            break;            
            case "Update Employee Role":
                db.loadEmployees(updateEmployeeRolePickEmp);
            break;          
            case "Update Employee Manager":
                db.loadEmployees(updateEmployeeManagerPickEmp);
            break;
            case "View All Departments":
                db.loadDepts(showDepts);
            break;
            case "View Employees by Manager":
                db.loadManagers(showEmployeeByManager);
            break;
            case "View All Employees":
                db.loadEmployees(showEmployees);
            break;
            case "Exit":
            process.exit();
        }
    });
}
function updateEmployeeManagerPickEmp(empArray){
    let eChoice=[]; 
    for(e of empArray){
        eChoice.push({name:(e['First Name']+" "+e['Last Name']), value:e.ID});
    }
    inquirer.prompt({
        message:"Choose Employee.",
        type:"list",
        name:"emp",
        choices:eChoice
    }) .then(function(answers){
        
    console.clear();
        db.loadRoles(updateEmployeeManagerPrompt, answers);
    });
}
function updateEmployeeRolePickEmp(empArray){
    let eChoice=[]; 
    for(e of empArray){
        eChoice.push({name:(e['First Name']+" "+e['Last Name']), value:e.ID});
    }
    inquirer.prompt({
        message:"Choose Employee.",
        type:"list",
        name:"emp",
        choices:eChoice
    }) .then(function(answers){
        
    console.clear();
        db.loadRoles(updateEmployeeRolePrompt, answers);
    });
}
function updateEmployeeRolePrompt(array, id){
    // We get an array of manager objects and an array of role objects
    const rChoice=[];
    for(r of array){
        let test={};
        test.value=r.ID;
        test.name=r.Position+", "+r.Department+" Department",
        rChoice.push(test);
    }    
    inquirer.prompt({
            message:"New role:",
            name:"role",
            type:"list",
            choices:rChoice
    }).then(
        (answers)=>{
           console.clear();
        //    console.log("ID:"+JSON.stringify(id));
            db.updateEmployeeInfo("role_id", answers.role, id.emp, showEmployees);
        }
    )
}
function showEmployees(employeeArray){
    console.table(employeeArray);
    mainMenu();
}
function showDepts(deptArray){
    console.table(deptArray);
    mainMenu();
}
function showEmployeeByManager(managerArray){
    let mChoice=[];
    for(m of managerArray){
        mChoice.push({name:(`${m.first_name} ${m.last_name}, Manager of ${m.name}`),value:m.id});
    }
    inquirer.prompt({
        message:"Please choose manager:",
        name:"mChoice",
        type:"list",
        choices:mChoice
    }).then(function(answers){
        db.loadEmployees(showEmployees, answers.mChoice)
    });
}

function addEmployeeRoles(managers){
    
    console.clear();
    db.loadRoles(addEmployeePrompt, managers);
}
function addRolePrompt(depts){
    
    console.clear();
    let dChoice=[];
    for(d of depts){
        dChoice.push({name:d.Department, value:d.ID});
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
        console.clear();
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
        
    console.clear();
        db.addDepartmentInfo(answers, mainMenu);
    });
}

function addEmployeePrompt(roles, managers){
    // We get an array of manager objects and an array of role objects

    console.clear();
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
        test.value=r.ID;
        test.name=r.Position+", "+r.Department+" Department",
        rChoice.push(test);
    }    
    mChoice.push({name:"No manager assigned", value:0});
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
            // if(answers.managerChoice===0) answers.managerChoice="";
            db.addEmployeeInfo(answers, showEmployees);
        }
    )
}
init();