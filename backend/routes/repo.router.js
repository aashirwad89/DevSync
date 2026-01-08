const express = require('express');
const repoController = require("../controllers/repoController")

const repoRouter = express.Router();


repoRouter.post("/repo/create", repoController.createRepo);
repoRouter.get("/repo/all", repoController.getAllrepositary);
repoRouter.get("/repo/:id", repoController.fetchrepositaryById);
repoRouter.get("/repo/name/:repoName", repoController.fetchrepositaryByName);
repoRouter.get("/repo/user/:userId", repoController.fetchrepositaryForCurrentUser);
repoRouter.put("/repo/update/:id", repoController.updaterepositaryById);
repoRouter.delete("/repo/delete/:id", repoController.deleterepositaryById);
repoRouter.patch("/repo/toggle", repoController.toggleVisiblityById);



module.exports = repoRouter;