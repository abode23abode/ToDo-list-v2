//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require("mongoose");
const _ =require("lodash");
const date=require(__dirname+"/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-abdulillah:test123@cluster0.ur1gykz.mongodb.net/todolistDB",{useNewUrlParser:true});

const itemsSchema={

  name:String

};

const Item=mongoose.model("Item",itemsSchema);

const item1 =new Item({
  name:"Welcome !"
})
const item2 =new Item({
  name:"Press the + to creat new item !"
})
const item3 =new Item({
  name:"<-- hit that to delet the item  ! "
})

 const defaultItems =[item1,item2,item3];

 const listSchema={

  name:String,
  items:[itemsSchema]
 }
 const List = mongoose.model("List",listSchema)

//  Item.insertMany(defaultItems,function(err){
//   if(err){
//    console.log(err)
//   }else{
//     console.log("done inserting ")
//   }
//  });

const day=date.getDate();

app.get("/", function(req, res) {

  Item.find({},function(err,foundItems){
    if(err){
      console.log(err)
     }else{
      if(foundItems.length===0){
         Item.insertMany(defaultItems,function(err){
         if(err){
          console.log(err)
          }else{
          console.log("done inserting ")
         }
 });
      }
      res.render("list", {listTitle: day, newListItems: foundItems});
  
     }
   })
  
});

app.get("/:adress",function(req,res){

   const customAdress=_.capitalize(req.params.adress); 

   List.findOne({name:customAdress},function(err,foundlist){
    if(err){
      console.log(err)
    }else{
      
      if(!foundlist){
        // creat new
        const list=new List({
          name:customAdress,
          items:defaultItems
      
          });
          list.save();
         res.redirect("/"+customAdress);
      }else{
        //show old
        res.render("list", {listTitle:customAdress, newListItems: foundlist.items});
        
      }
    }
   })
    
   
})


app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;
  
  const item=new Item({
    name:itemName
  })
  if(listName==="Today"){
    item.save();
    res.redirect("/")
  } else{

    List.findOne({name:listName},function(err,foundList){
      if(err){
      console.log(err)
      }else{
        
        foundList.items.push(item)
        foundList.save();
        res.redirect("/"+listName);
      }
     
    })
  }

 

 
});

app.post("/delete",function(req,res){
 const checkedItemId= req.body.checkbox;
 const listName =req.body.lsitName;

if(listName==="Today"){
  Item.findByIdAndRemove(checkedItemId,function(err){
    if(err){
      console.log(err)
    }else{
      console.log("deleted successed")
      res.redirect("/")
    }
    
    })
  
}else{

   List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
    if(!err){
      
      res.redirect("/"+listName)
    }else{
      console.log(err)
    }
   })

}


})


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT|| 3000, function() {
  console.log("Server started on port 3000");
});