// Entry Point - index.js

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




yargs(hideBin(process.argv))
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
