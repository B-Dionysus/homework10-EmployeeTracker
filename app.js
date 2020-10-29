const inquirer=require("inquirer");
const connection=require("./connection.js");
const db=require("./db.js");
const cTable=require("console.table");
const figlet=require("figlet");


function init(){ 
  // Initiate MySQL Connection.
  connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }    
    else {
        // Once we have successfully connected to the database, clear the screen
        // and pop up a friend title screen
        console.clear();
        figlet("Employee Tracker", (err,data)=>{
            if(err) console.log("Figlet Error: "+err);
            else console.log(data);
            // If the title screen has any errors, it will be a bit ugly, but there'
            // no reason not to run the rest of the app.
            console.log("\n\nConnected as id " + connection.threadId+"\n\n");
            // Start the main menu
            mainMenu();
        })
    }
 });
}
// Inquirer lists all of the available options for the user. In most cases, when the user selects one of these 
// options it will trigger a call to what I have recently learned is called an ORM, db.js. The functions in this
// file take a callback function, and once they have performed a database query they call that function with the
// data. That callback function is here in this file, server.js.
function mainMenu(){
    inquirer.prompt({
        message:"Main Menu",
        name:"menuChoice",
        type:"list",
        choices:["Add Employee", "Add Department", "Add Role","Update Employee Role", "Update Employee Manager", "View All Roles","View All Departments","View Employees by Manager", "View All Employees", "View Department Budgets", "Exit"]
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
            case "View Department Budgets":
                db.loadBudgets(showBudgets);
            break;
            case "Exit":
            process.exit();
        }
    });
}
// **========================================================**
// *                                                          * 
// *       GET Functions                                      * 
// *                                                          * 
// **========================================================**
function showEmployees(employeeArray){
    console.table(employeeArray);
    mainMenu();
}
function showDepts(deptArray){
    console.table(deptArray);
    mainMenu();
}
function showBudgets(budgetArray){
    console.table(budgetArray);
    mainMenu();
}

// **========================================================**
// *                                                          * 
// *       POST Functions                                     * 
// *                                                          * 
// **========================================================**

// db.loadEmployees get a list of all the employees, and pass it to updateEmployeeManagerPickEmp()
// after updateEmployeeManagerPickEmp gets the user to choose an employee, it calls db.loadManagers
// this passes the user's chosen employee id and an array of all managers here, and the user can
// pick a different manager for the selected employee
function updateEmployeeManagerPrompt(array, id){
    // We get an array of manager objects 
    console.log(array);
    const mChoice=[];
    for(m of array){
        let test={};
        test.value=m.id;
        test.name=m.first_name+" "+m.last_name+", Manager of "+m.name,
        mChoice.push(test);
    }    
    inquirer.prompt({
            message:"New Manager:",
            name:"manager",
            type:"list",
            choices:mChoice
    }).then(
        (answers)=>{
           console.clear();
        //    console.log("ID:"+JSON.stringify(id));
            db.updateEmployeeInfo("manager_id", answers.manager, id.emp, showEmployees);
        }
    )
}
// db.loadEmployees get a list of all the employees, and pass it to updateEmployeeRolePickEmp()
// after updateEmployeeRolePickEmp gets the user to choose an employee, it calls db.loadRoles.
// this passes the user's chosen employee id and an array of all roles here, and the user can
// pick a different role for the selected employee
function updateEmployeeRolePrompt(array, id){
    // We get an array of role objects
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

// The user enters a new department, which is sent to db.addDepartmentInto to get entered into the database
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
// db.loadRoles sends us an array of all of the departments. Then the user enters a new role, and selects the 
// department with which it is affiliated
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

// db.loadManagers passes an array of all managers to addEmployeeRoles, which calls db.loadRoles
// This returns an array of all of the roles, as well as the array of managers, to addEmployeePrompt, here
// Once the user enters the emplyee name and selects and role and a manager, this is passed to db.addEmployeeInfo
// To get sent to the database.
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
    rChoice.push({name:"No role assigned", value:0});
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
// **========================================================**
// *                                                          * 
// *       Prep Functions / Middleware                        * 
// *          Taking DB data and providing it to another      * 
// *          function, which will then make a db call        * 
// *                                                          * 
// **========================================================**

// This takes the array of all employees and asks the user to choose one. It passes that ID to
// loadManagers, and tells it to call updateEmployeeManagerPrompt when it's done
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
        db.loadManagers(updateEmployeeManagerPrompt, answers);
    });
}
// This takes the array of all employees and asks the user to choose one. It passes that ID to
// loadRoles, and tells it to call updateEmployeeRolePrompt when it's done
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
// This takes the array of all managers and asks the user to choose one. It passes that ID to
// loadEmployees, and tells it to call showEmployees when it's done
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
// This takes the array of all managers passes it to db.loadRoles, telling it to
// call addEmployeePrompt when it's done
function addEmployeeRoles(managers){
    
    console.clear();
    db.loadRoles(addEmployeePrompt, managers);
}

// Start everything off!
init();