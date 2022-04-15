
import express, { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid';
var bodyParser = require('body-parser');
const jwt = require("jsonwebtoken")
import dotenv from 'dotenv'
import router from './routers/Routers';

const multer = require('multer')
dotenv.config();
const app = express()
const upload = multer({
    storage: multer.memoryStorage()
})
app.use(upload.single())


app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var cors = require('cors')

app.use(cors())

app.use(router)



app.listen(3002, () => {
    console.log("Port: 3000");
})
