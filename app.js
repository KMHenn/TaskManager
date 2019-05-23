/**
 * HW 4: Task Manager
 * Kaitlyn Hennessy
 * kmh319
 */

var express = require("express");
var path = require("path");
var logger = require("morgan");
var bodyParser = require('body-parser');
var app = express();
let maxId = 0;
let taskRec = new Map();
let tblHTML = "";

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Redirect to the page itself
app.get("/", function(req, res) {
   res.redirect("/task_manager");
 });

 // Page framework
app.get("/task_manager", function(req, res){
    res.render("taskmanager", {
        taskRecord: tblHTML
    });
});

// Add a task to the Map and table
app.post("/addTask", function(req, res){
    let newTask = new Task(maxId, req.body.task, req.body.type, req.body.datedue);
    maxId = maxId + 1;
    taskRec.set(newTask.id, newTask);
    tblHTML = "";
    taskRec.forEach(buildRow);
    res.redirect("/task_manager");
});

// Delete submitted tasks
app.post("/deleteTasks", function(req, res){
    let numArrStr = JSON.parse(JSON.stringify(req.body))["idList"];
    
    // Only one task to delete, no String splitting needed
    if (!numArrStr.includes(",")){
        // console.log("numArrStr:\t" + numArrStr + "\nRemoving:\t" + (taskRec.get(parseInt(numArrStr))).task);
        taskRec.delete(parseInt(numArrStr));
    }
    
    // More than one task to delete
    else{
        let numArr = numArrStr.split(",");
        for (let i = 0; i < numArr.length; i++){
            let num = parseInt(numArr[i]);
            // console.log("i:\t" + i + "numArr Val:\t" + num + "\nTask Rec:\t" + taskRec.get(num));
            taskRec.delete(num);
        }
    }

    console.log("Rebuilding table");
    tblHTML = "";
    taskRec.forEach(buildRow);
    res.redirect("/task_manager");
 });

app.use(function(request, response) {
    response.statusCode = 404;
    response.end("404!");
});
app.use(logger("dev"));
app.listen(3000);

/**
 * Task class
 */
class Task{
    constructor(id, task, type, date){
        this.id = id;
        this.task = task;
        this.type = type;
        this.date = date;
        //this.printForm();
    }

    printForm(){
        console.log("ID:\t" + this.id + "\nDescrip:\t" + this.task + "\nType:\t" + this.type + "\nDue:\t" + this.date); 
    }
}

// Build out the HTML row needed
function buildRow(values, key){
    let curTask = taskRec.get(key);
    let tempHTML = "<tr id='task" + curTask.id + "'>";

    tempHTML += "<td style='width: 20px; text-align: center; vertical-align: middle'><input type='checkbox' id='check" + curTask.id + "'/></td>"
    tempHTML += "<td style='width: 150px; text-align: center; vertical-align: middle'>" + curTask.task + "</td>";
    tempHTML += "<td style='width: 150px; text-align: center; vertical-align: middle'>" + curTask.type + "</td>";
    tempHTML += "<td style='width: 80px; text-align: center; vertical-align: middle'>" + curTask.date + "</td>";

    tempHTML += "</tr>";
    tblHTML += tempHTML;
 }