const express = require('express');
const repoController = require("../controllers/repoController")

const repoRouter = express.Router();


repoRouter.post("/repo/create", repoController.createRepo);
repoRouter.get("/repo/:id", repoController.fetchrepositaryById);
repoRouter.get("/repo/:name", repoController.fetchrepositaryByName);
repoRouter.get("/repo/:userId", repoController.fetchrepositaryForCurrentUser);
repoRouter.get("/repo/update/:id", repoController.updaterepositaryById);
repoRouter.delete("/repo/delete/:id", repoController.deleterepositaryById);
repoRouter.get("/repo/toggle", repoController.toggleVisiblityById);
repoRouter.get("/repo/all", repoController.getAllrepositary);


module.exports = repoRouter;