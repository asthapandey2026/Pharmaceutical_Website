import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import logger from "./src/v1/logs/logger.js";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import dbConnection from './src/v1/dbConnection/dbConnection.js';

const app = express();
dbConnection();


app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's origin
  allowedHeaders: 'Content-Type , Authorization',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);


// Routes
import userRouter from './src/v1/routes/user.router.js';
import adminRouter from './src/v1/routes/admin.router.js';
app.use('/v1/users',  userRouter);
app.use('/v1/admin',  adminRouter);


app.get('/', (req, res) => {    
    res.send('Hello World!');
});

export default app;