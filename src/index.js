// require('dotenv').config({path : './env'})
import dotenv from 'dotenv'
import app from './app.js';

import {dbconnect} from "./db/index.js";

dotenv.config({
    path : './.env'
})


dbconnect()
.then(()=>{
    app.listen(process.env.PORT || 5000 , ()=>{
        console.log(`server is running at port : ${process.env.PORT}`);
        // app.on(error, ()=>{
        //     console.log("erorr",error);
        //     throw error
        // })
        
    })
})
.catch((error)=>{
    console.log("mongodb connection failes",error);
    
})



















/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express"
const app= express();

;(async()=>{
    try {
        await mongoose.connect(`${process.env.MongoDB_URI} /${DB_NAME} `)
        app.on("error",()=>{
            console.log("error in on ",error);
            throw error
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`app is lisnening${process.env.PORT}`)
        })

    } catch (error) {
        console.log("error finded ", error);
        throw error
    }
})()
    */
