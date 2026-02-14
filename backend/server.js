
const express  = require('express');
const yargs = require('yargs');
const {hideBin} = require('yargs/helpers')
const {initRepo} = require('./controllers/init')
const {addRepo} = require('./controllers/add')
const {commitRepo} = require('./controllers/commit')
const {pullRepo} = require('./controllers/pull')
const {pushRepo} = require('./controllers/push')
const {revertRepo} = require('./controllers/revert')


yargs(hideBin(process.argv)).command('init', "Intialise a new repositary",
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
        },
        revertRepo
     )
     .demandCommand(1, "You need atleast one Command to start")
     .help().argv;
const app = express();

app.get("/", (req, res)=>{
    res.send("Root route is working");
})

