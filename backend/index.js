// Entry Point - Index.js

import yargs, { hide } from "yargs";
import {hideBin} from "yargs/helpers";

yargs(hideBin(process.argv)).command("init", "Intialise a new repositary", {});