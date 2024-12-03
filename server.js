import express from "express";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
// Middleares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(fileUpload());
app.get('/',(req,res)=>{
    return res.json({
        message:"Hello its working"
    })
});

//Importing Routes
import ApiRoutes from "./routes/api.js";
app.use('/api',ApiRoutes);

app.listen(PORT,()=>{
    console.log('Server listening on: ',PORT)
});