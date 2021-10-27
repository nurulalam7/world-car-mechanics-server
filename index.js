const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const cors=require('cors');

require('dotenv').config()
const app=express();
const port=process.env.PORT || 5000;


// middlware 

app.use(cors());
app.use(express.json());
// step 3
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wprwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// step 4
async function run (){
    try {
        
       await client.connect();

       const database=client.db('carmechanics');
       const servicecollection=database.collection('services');

      //    get api 

      app.get('/services',async(req,res)=>{
          const cursor=servicecollection.find({});
          const services=await cursor.toArray();
          res.send(services);
      });

    //   get single service 

    app.get('/services/:id',async(req,res)=>{

        const id=req.params.id;
        console.log('getting id',id);
        const query={_id:ObjectId(id)};
        const service=await servicecollection.findOne(query);
        res.json(service);
    });



    //    create post api 
    app.post('/services',async(req,res)=>{
        const service=req.body;
        console.log('hit the post',service);
            

        
        // const result=await servicecollection.insertOne(service);
        // console.log(result);

        const result=await servicecollection.insertOne(service);
        console.log(result);


        res.json(result)
      });
       // for checking connect data base 
     //    console.log('connected to data base')


       //  delete post 
       app.delete('/services/:id',async(req,res)=>{
           const id=req.params.id;
           const query={_id:ObjectId(id)};
           const result=await servicecollection.deleteOne(query);
           res.json(result);

       })



    }
    finally{
        // await client.close 
    }

}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('running car service');
});
app.listen(port,()=>{
    console.log('runnnig genis service on port',port);
});