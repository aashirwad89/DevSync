// Entry Point - Index.js

import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import {initRepo} from "./controllers/init.js"
import { addRepo } from "./controllers/add.js";
import { commitRepi } from "./controllers/commit.js";
import { pushRepo } from "./controllers/push.js";
import { pullRepo } from "./controllers/pull.js";
import { revertRepo } from "./controllers/revert.js";

yargs(hideBin(process.argv)).command(
    "init", 
    "Intialise a new repositary",
     {}, 
initRepo)
.command(
    "add <file>", 
    "Add a file to the repositary",
     (yargs)=>{yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
     })}, 
addRepo)
.command(
    "commit <message>", 
    "Commit the staged files",
     (yargs)=>{yargs.positional("message", {
        describe: "Commit Messgae",
        type: "string",
     })}, 
commitRepi)
.command(
    "push", 
    "Push commits to S3", {}, 
pushRepo)
.command(
    "pull", 
    "Pull commits fromm S3", {}, 
pullRepo)
.command(
    "revert <commitID>", 
    "Revert to a specific commit",
     (yargs)=>{yargs.positional("commitID", {
        describe: "Commit ID to revert it",
        type: "string",
     })}, 
revertRepo)
.demandCommand(1, "You need atleast one command").help().argv;

