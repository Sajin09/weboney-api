const express = require('express')
const db = require('../models/db')
const {ObjectId} = require('mongodb')


const route = express.Router()



route.post('/', async (req, res) => {
   try {
     let { name, email, password } = req.body;
     let database = await db.getdatabase();
     const collection = database.collection('users');
     const data = { name, email, password };
 
     const user = await collection.insertOne(data);
     if (!user) {
       return res.status(400).json({ message: "User not added" });
     }
 
     res.status(200).json({ message: "User added" });
   } catch (err) {
     console.error(err);
     res.status(500).json({ message: "Internal Server Error" });
   }
 });
 
 route.post('/login', async (req, res) => {
   try {
       console.log(req.body);
       let { email, password } = req.body;

       if (!email || !password) {
           return res.status(400).json({ message: "Email and password are required" });
       }

       let database = await db.getdatabase();
       let collection = database.collection('users');
       let user = await collection.findOne({ email: email });

       if (user && user.password === password) {
           res.status(200).json({ message: "Login successful", user });
       } else {
           res.status(401).json({ message: "Invalid email or password" });
       }
   } catch (err) {
       console.log(err);
       res.status(500).json({ message: "Internal server error" });
   }
});

 
 route.post('/edit', async (req, res) => {
   try {
     let { _id, name, email, password } = req.body;
     let userId = new ObjectId(_id);
     let database = await db.getdatabase();
     let collection = database.collection('users');
 
     let cursor = await collection.findOne({ _id: userId });
 
     if (cursor) {
       await collection.updateOne({ _id: userId }, { $set: { name, email, password} });
       return res.status(200).json({ message: "User updated successfully" });
     } else {
       return res.status(404).json({ message: "User not found" });
     }
   } catch (err) {
     console.error(err);
     res.status(500).json({ message: "Internal Server Error" });
   }
 });
 

route.get('/login', async(req, res)=>{
   try{
      let database = await db.getdatabase()
      let collection= database.collection('users')
      let userdata =  collection.find({})
      let cursor = await userdata.toArray()
      res.status(200).json(cursor)

   }
   catch(err){
       console.log(err)
   }
})

route.post('/delete',async(req, res)=>{
  try{
   let data = req.body
   let database = db.getdatabase()
   let collection = (await database).collection('users')
   const cursor = await collection.find({_id: new ObjectId(data._id)})
   let user = await cursor.toArray()
   if(user.length == 1){
     await collection.deleteOne({_id: new ObjectId(data._id)})
     return res.status(200).send({message:"deleted successfully"})
   }

  }
  catch(err){
     console.log(err)
  }
})

module.exports = route