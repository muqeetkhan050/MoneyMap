const mongoose=require('mongoose');

const conncetDB=async()=>{
    try{
        await mongoose.conncet(process.env.MONGO_URL)
        console.log('MongoDB connected');
     }catch(error){
        console.log('MongoDB connection error:',error);
        process.exit(1);
     }
}

module.exports=conncetDB