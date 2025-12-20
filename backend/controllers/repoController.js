const mongoose = require('mongoose');
const Repository = require('../models/repoModel')

const createRepo = async (req, res)=>{
    res.send("Repo is created")
}

const getAllrepositary = async (req, res)=>{
    res.send("All repo gotted");
}

const fetchrepositaryById = async (req, res)=>{
    res.send("All repos fetched by Id");
}

const fetchrepositaryByName = async (req, res)=>{
    res.send("All repo fetched by name");
}

const fetchrepositaryForCurrentUser = async (req, res)=>{
    res.send("All repo fetched for current user");
}

const updaterepositaryById = async (req, res)=>{
    res.send("All repo update by Id");
}

const toggleVisiblityById = async (req, res)=>{
    res.send("Toggle visible by ID");
}

const deleterepositaryById = async (req, res)=>{
    res.send("All repo got deleted by ID");
}

module.exports = {
    createRepo,
    getAllrepositary,
    fetchrepositaryById,
    fetchrepositaryByName,
    fetchrepositaryForCurrentUser,
    updaterepositaryById,
    toggleVisiblityById,
    deleterepositaryById
}






