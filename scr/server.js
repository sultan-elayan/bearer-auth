'use strict';
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const errorHandler=require('./error-handlers/500');
const pageNotFound=require('./error-handlers/404'); 
const basicAuth = require('./middleware/basicAuth');
const bearerAuth = require('./middleware/bearerAuth');
const Users = require('./models/user');
const {Sequelize, DataTypes} = require('sequelize');
const DATABASE_URL = process.env.NODE_ENV="test" ?'sqlite:memory' :'postgres://localhost:5432/sultan-elayan';
const sequelize = new Sequelize(DATABASE_URL, {});
const UserModel = Users(sequelize, DataTypes);


app.use(express.json());

app.use(express.urlencoded({ extended: true }));
let  start = (port)=> {
    app.listen(port, ()=> console.log(`listening to port : ${port}`))
}
// ===================== sign up =============================== 
app.post('/signup', async(req, res, next) => {
  try {
      req.body.password = await bcrypt.hash(req.body.password, 10);
      const record = await UserModel.create({
          username : req.body.username,
          password: req.body.password
      });   
      res.json(record);
  } catch (e) {
      next('some thing wrong ') }
});

// ===================== sign in =============================== 
app.post('/signin', basicAuth (UserModel), (req, res, next)=> {
  res.status(200).json(req.user);
});

// ===================== Bearer TOKEN TEST =============================== 
app.get('/secretstuff', bearerAuth (UserModel), (req, res) => {
  res.json(req.user);
})


// ===================== test page =============================== 
app.get('/home', (req, res) => {
  res.json({msg: 'this home page'});
});

app.use('*',pageNotFound)
app.use(errorHandler)


module.exports = {start: start,
  db: sequelize,
  UserModel:UserModel,
  server:app,
  
}