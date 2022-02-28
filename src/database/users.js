const express = require('express');
const {getDatabase} = require('./mongo');
const {ObjectId} = require('mongodb');
const collectionName = 'users';
const app = express();
const { body, validationResult } = require('express-validator');

async function addUser(user) {
    const database = await getDatabase();
    const {addedUSer} = await database.collection(collectionName).insertOne(user);
    return addedUSer;
}  

module.exports = {
    addUser,
  };

