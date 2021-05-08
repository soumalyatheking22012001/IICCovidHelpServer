const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("../MiddleWares/JWT");
const addUser = require("../Database/NewUser");
const addSession = require("../Database/AddSession");
const hashPassword = async (pass) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(pass, saltRounds);
  return hash;
};

const NewUser = (req, res, next) => {
  const body = req.body;
  hashPassword(body.Password)
    .then((hash) => {
      res.locals.passHash = hash;
      next();
    })
    .catch((error) => {
      console.log("Could not generate hash for the given passwords");
      next("route");
    });
};

const SaveUser = (req, res, next) => {
  let User = {
    Email: req.body.Email,
    Name: req.body.Name,
    Password: res.locals.passHash,
  };
  addUser
    .AddUser(User)
    .then((response) => {
      console.log("From DB", response);
      if (response.error === null) {
        res.locals.usertoSend = {
          Email: response.data.Email,
          Name: response.data.Name,
        };
        next();
      } else {
        console.log("Error occoured while saving user to DB", response.error);
        next("route");
      }
    })
    .catch((error) => {
      console.log("Promise of saving User to Database got Rejected", error);
      next("route");
    });
};

const startSession = (req, res) => {
  let activeUser = {
    Email: req.body.Email,
    Refresh_Token: res.locals.jwt.refreshToken,
  };
  addSession
    .AddSession(activeUser)
    .then((response) => {
      console.log(response);
      res.status(200).send(res.locals.jwt);
    })
    .catch((err) => {
      console.error(err);
      res.status(200).json("Session couldnot be started for the provided user");
    });
};

router.post("/", NewUser, SaveUser, jwt.setJWT, startSession);

module.exports = router;
