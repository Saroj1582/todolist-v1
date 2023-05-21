const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const date = require(__dirname + "/export.js");
const mongoose = require("mongoose");
const { strict } = require("assert");
const _ = require("lodash");

const app = express();

mongoose.connect("mongodb+srv://admin-saroj:Saroj1628@cluster0.pbqtp.mongodb.net/todolistDB");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

const itemSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model("Item", itemSchema);

const listSchema = new mongoose.Schema({
    name: String,
    listItem: [itemSchema]
})

const List = mongoose.model("List", listSchema);

const item1 = new Item({
    name: "Workout"
})

const item2 = new Item({
    name: "Code"
})

const item3 = new Item({
    name: "Sleep"
})


const defaultItems = [item1, item2, item3];



// List.deleteMany({name: "work"})
// .then(function(){
//   console.log("Deleted Successfully");
// })
// .catch(function(err){
//   console.log(err);
// })

app.get("/", async function(req, res){
   
    var todayDate = date.getDay();

    var foundItems = await Item.find()

    if (foundItems.length===0) {
        Item.insertMany([defaultItems])
        .then(function(){
            console.log("Items added to database successfully");
            res.redirect("/");
        })
        .catch(function(err){
            console.log(err);
        })
       
    } else {
        res.render("list", {day: todayDate, newItems: foundItems});
    }

    
})

app.get("/:userRequest", async function(req, res){
    const userRequest = _.capitalize(req.params.userRequest);

    const searchedList = await List.findOne({name: userRequest})
    
    if (searchedList) {
        
        res.render("list", {day: userRequest, newItems: searchedList.listItem});
    } else {
        const list = new List({
            name: userRequest,
            listItem:defaultItems
        }) 
        list.save();
        res.redirect("/" + userRequest);
    }

    
    
    
})

app.post("/", function(req, res){
   
    let itemName = req.body.todoItem;
    let listName = req.body.list;

    const item = new Item({
        name: itemName
    })

    if (listName===date.getDay()) {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}).then(function(foundList){
            foundList.listItem.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
        .catch(function(err){
            console.log(err);
        })
    }

    
})



app.post("/delete", function(req, res){
    const itemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName===date.getDay()) {
        Item.findByIdAndDelete({_id: itemId})
        .then(function(){
        console.log("Item deleted successfully");
        res.redirect("/");
        })
        .catch(function(err){
        console.log(err);
        })
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {listItem: {_id: itemId}}})
        .then(function(foundItem){
            res.redirect("/" + listName);
        })
        .catch(function(err){
            console.log(err);
        })
    }
    
})

app.get("/about", function(req, res){
    res.render("about");
})

app.listen(3000, function(){
    console.log("Server started on port 3000");
})