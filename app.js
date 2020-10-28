const inquirer=require("inquirer");
const connection=require("./connection.js");
const db=require("./db.js");
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
        choices:["Add Employee", "Exit"]
    }) .then(answers=>{
        switch(answers.menuChoice){
            case "Add Employee":
                addEmployeeManagers();
            break;
            case "Add Role":
                addRoleDepartments();
            break;

            case "Exit":
            process.exit();
        }
    });
}
function addEmployeeManagers(){
    db.loadManagers(addEmployeeRoles);
}
function addEmployeeRoles(managers){
    db.loadRoles(addEmployeePrompt, managers);
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