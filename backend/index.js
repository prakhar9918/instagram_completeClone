import express, { urlencoded } from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
dotenv.config();

import connectDb from './utils/db.js';


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));



const corsOption = {
    origin : 'http://localhost:5173',
    credentials :true
}
app.use(cors(corsOption));
const port =  process.env.PORT;

app.get("/",(req,res)=>{
    return res.status(200).send({
        message : "Hello coming from backend",
        success:true
    })
})

app.listen(port,()=>{
    connectDb();
    console.log(`Server is listing at ${port}`);
})
