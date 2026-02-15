const express  = require('express');
const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const http = require('http')
const yargs = require('yargs');
const {Server} = require('socket.io')




const {hideBin} = require('yargs/helpers')
const {initRepo} = require('./controllers/init')
const {addRepo} = require('./controllers/add')
const {commitRepo} = require('./controllers/commit')
const {pullRepo} = require('./controllers/pull')
const {pushRepo} = require('./controllers/push')
const {revertRepo} = require('./controllers/revert')

dotenv.config();

yargs(hideBin(process.argv))
.command("start", "Starts a new Server", {}, startServer)
.command('init', "Intialise a new repositary",
     {}, initRepo)
     .command("add <file>", "Add a file to the repo", (yargs)=> {yargs.positional("file", {
        describe: "File to add to the staging area",
        type:"string",
     })}, (argv)=>{
        addRepo(argv.file)
     })
     .command("commit <message>", "Commit the staged files", (yargs)=>{
        yargs.positional("message", {
            describe: "Commit message",
            type: "string",
        })
     }, (argv)=>{
        commitRepo(argv.message)
     })
     .command("push", "Push commit to S3", {}, pushRepo)
     .command("pull", "Pull commits from S3", {}, pullRepo)
     .command(
        "revert <commitID>",
        "Revert to a specific commit",
        (yargs)=>{
            yargs.positional("commitID", {
                describe: "Commit ID to revert to",
                type: "string"
            })
        }, (argv)=>{
         revertRepo(argv.commitID);
        }
        
     )
     .demandCommand(1, "You need atleast one Command to start")
     .help().argv;


     function startServer(){
      const app = express();
      const port = process.env.PORT || 8000;

      app.use(bodyParser.json());
      app.use(express.json());

      const mongoURI = process.env.MONGODB_URI;
      mongoose.connect(mongoURI).then(()=>
         console.log("Mongodb connected 🚀")
      ).catch((err) => console.log(err, "unable to connect"));

      app.use(cors({origin:"*"}));

      app.get("/", (req, res)=>{
         res.send("Welcome to the backend of Devsync")
      })

let user = "test";

      const httpServer = http.createServer(app);
      const io = new Server(httpServer, {
         cors: {
            origin: "*",
            methods: ["GET", "POST"],
         }
      })

      io.on("connection", (socket)=>{
         socket.on("joinRoom", (userId)=>{
            user = userId,
            console.log("=============")
            console.log(user);
            console.log("==============")
            console.log(userId);
         });
      })


      const db = mongoose.connection;

      db.once("open", async()=>{
         console.log("CRUD operations called")
         // CRUD operations add krna hai idhr
      })
httpServer.listen(port, ()=>{
   console.log(`Server is running on http://localhost/${port} 🚀🚀`)
})

     }





