// const express = require('express');
import express from 'express'
import morgan from 'morgan';
import connectDatabase from './src/config/connectDB';
import cors from 'cors'

import authRouter from './src/routers/authRouter'
import categoryRouter from './src/routers/categoryRouter'
import productRouter from './src/routers/productRouter'
import brandRouter from './src/routers/brand'
import imageRouter from './src/routers/imageRouter'

import cookieParser from 'cookie-parser';
import path from 'path'

const app = express();

require('dotenv').config()

app.use(cookieParser())

connectDatabase()

app.use(cors({
  origin: process.env.URL_CLIENT,
  methods: ["POST", 'GET', 'PUT', 'DELETE'],
  credentials: true
}))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Welcome To API')
})
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));


app.use('/api/', authRouter);
app.use('/api/', categoryRouter);
app.use('/api/', productRouter);
app.use('/api/', brandRouter);
app.use('/api/', imageRouter);

//
app.use('/api', contactRouter);

app.use((req, res) => {
  return res.send('404 Not Found')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server chạy thành công http://localhost:${PORT}`);
})