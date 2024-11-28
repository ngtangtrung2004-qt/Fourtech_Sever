// const express = require('express');
import express from 'express'
import morgan from 'morgan';
import connectDatabase from './src/config/connectDB';
import cors from 'cors'

import authRouter from './src/routers/authRouter'
import categoryRouter from './src/routers/categoryRouter'
import productRouter from './src/routers/productRouter'
import contactRouter from './src/routers/contactRouter'
import brandRouter from './src/routers/brandRouter'
import imageRouter from './src/routers/imageRouter'
import passwordController from './src/routers/passwordController'
import cartRouter from './src/routers/cartRouter'
import paymentMethodRouter from './src/routers/paymentMethodRouter'
import commentRouter from './src/routers/commentRouter'
import orderRouter from './src/routers/orderRouter'
import newsRouter from './src/routers/newsRouter'
import revenueRouter from './src/routers/revenueRouter'

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
app.use('/api/', cartRouter);
app.use('/api/', paymentMethodRouter);
app.use('/api/', orderRouter);
app.use('/api/', revenueRouter);

//
app.use('/api', contactRouter);
//
app.use('/api', passwordController);
//
app.use('/api', commentRouter)
//
app.use('/api', newsRouter)

app.use((req, res) => {
  return res.send('404 Not Found')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server chạy thành công http://localhost:${PORT}`);
})