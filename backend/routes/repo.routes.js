const express = require('express')
const repoController = require("../controllers/repoController")


const repoRouter = express.Router()

repoRouter.post("/createRepo", repoController.createRepositary);
repoRouter.get("/repo/all", repoController.getAllRepositaries);
repoRouter.get("/repo/:id", repoController.fetchRepositaryById);
repoRouter.get("/repo/:name", repoController.fetchRepositaryByName);
repoRouter.get("/repo/:userId", repoController.fetchRepositaryForCurrentUser)
repoRouter.put("/repo/update/:id", repoController.updateRepositaryById);
repoRouter.get("/repo/toggle/:id", repoController.toggleVisiblityById);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositaryById)


module.exports = repoRouter;