// Entry Point - index.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const http = require('http')
const {Server} = require('socket.io');
const mainRouter = require("./routes/main.route")


const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
require('dotenv').config();



const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");
const { listCommits } = require("./controllers/list");

dotenv.config();



yargs(hideBin(process.argv))
.command("start", "Starts a new server", {} , startServer )
  .command(
    "init",
    "Initialise a new repository",
    {},
    initRepo
  )
  .command(
    "add <file>",
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv)=>{
        addRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit Message",
        type: "string",
      });
    },
    (argv)=>{
    commitRepo(argv.message)
    }
  )
  .command(
    "push",
    "Push commits to S3",
    {},
    (argv)=>{
      pushRepo(argv.file)
    }
  )
  .command(
    "pull",
    "Pull commits from S3",
    {},
    (argv)=> {
      pullRepo(argv.file);
    }
  )
  .command(
    "revert <commitID>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit ID to revert to",
        type: "string",
      });
    },
    (argv)=>{
      revertRepo(argv.commitID)
    }
  )
  .command(
  "list",
  "List all available commits",
  {},
  () => {
    listCommits();
  }
)
  .demandCommand(1, "You need at least one command")
  .help().argv;


  function startServer(){
    const app = express();
   const port = process.env.PORT || 3000;


   app.use(bodyParser.json());
   app.use(express.json());
   
   const mongoURI = process.env.MONGODB_URI
  mongoose.connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected 🚀");
  })
  .catch((err) => {
    console.error("Unable to connect with mongoDb 🙂", err);
  });

   app.use(cors({origin: "*"}));
   app.use(mainRouter);

   const httpServer = http.createServer(app); 
   const io = new Server(httpServer, {
    cors:{
      origin: "*",
      methods:["GET", "POST"]
    }
   })

   io.on("connection", (socket)=>{
    socket.on("joinRoom", (userID)=>{
      userID = userID;
      console.log("====")
      console.log(user);
      console.log("====")
socket.join(userID);
    });
   })

   const db = mongoose.connection;
   db.once("open", async()=>{
    console.log("CRUD operations called");
    // crud operations are here
   })

   httpServer.listen(port, ()=>{
    console.log(`Server is running on PORT ${port}`)
   })
  }