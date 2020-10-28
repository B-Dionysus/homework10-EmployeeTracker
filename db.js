const connection=require("./connection.js");

function loadManagers(){
    connection.query("SELECT * FROM employee where ", function(err, result) {
        if(err) console.log(err);
        else{
            let html="";
            for(actor of result){
                html+=`ID: ${actor.id}, Name: ${actor.name}, a ${actor.attitude} person with ${actor.coolness_points} coolness points.`+"\n";
            }
            res.send(html);
            res.end();
        }
    });
}




module.exports={
    getCastData
}