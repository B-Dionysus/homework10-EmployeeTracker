const inquirer=require("inquirer");
const connection=require("./connection.js");

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
            addEmployee();
            break;

            case "Exit":
            process.exit();
        }
    });
}
function addEmployee(){

}

init();