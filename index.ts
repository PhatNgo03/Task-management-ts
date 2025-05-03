import express, { Express } from "express";
import dotenv from "dotenv";
// import bodyParser from "body-parser";
import * as database from "./config/database";
import cors from "cors";
import mainV1Routes from "./api/v1/routes/index.route";
dotenv.config();
database.connect();


const app: Express = express();
const port: number | string = process.env.PORT || 3000;

// c1: Parse application/json
// app.use(bodyParser.json());
//c2
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mainV1Routes(app);

//CORS
app.use(cors());
 
// var corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
// app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});




// DEPLOY project vercel
// import express, { Express } from "express";
// import dotenv from "dotenv";
// import * as database from "./config/database";
// import cors from "cors";
// import mainV1Routes from "./api/v1/routes/index.route";
// dotenv.config();
// database.connect();


// const app: Express = express();
// const port: number | string = process.env.PORT || 3000;

// // c1: Parse application/json
// // app.use(bodyParser.json());
// //c2
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// mainV1Routes(app);

// //CORS
// app.use(cors());
 
// import serverless from "serverless-http";

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// mainV1Routes(app);

// export const handler = serverless(app);
