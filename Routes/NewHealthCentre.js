const router = require("express").Router();
const { v4: uuidv4 } = require('uuid');
const verifyjwt = require("../MiddleWares/JWT");
const addCentre = require("../Database/HealthCentre");
const newHealthCentre = (req,res,next) =>{
    let body = req.body;
    console.log("Data that came: ", body);
    console.log("User that requested: ", res.locals.user);
    body.CreatorEmail = res.locals.user.Email;
    if(body.Oxygen!==NaN)
    {
        body.Oxygen = parseInt(body.Oxygen);
    }
    if(body.PhoneNumber!==NaN)
    {
        body.PhoneNumber = parseInt(body.PhoneNumber);
    }
    if(body.Beds.ICU!==NaN)
    {
        body.Beds.ICU = parseInt(body.Beds.ICU);
    }
    if(body.Beds.Normal!==NaN)
    {
        body.Beds.Normal = parseInt(body.Beds.Normal);
    }
    if(body.CovidVaccines.Quantity!==NaN)
    {
        body.CovidVaccines.Quantity = parseInt(body.CovidVaccines.Quantity);
    }
    if(body.Doctors!==NaN)
    {
        body.Doctors = parseInt(body.Doctors);
    }
    //Check wheather body has an uid key
    if(!body.uid)
    {
        body.uid = uuidv4();
    }
    console.log("Final body to add to DB\n", body);
    addCentre.AddCenter(body).then((response)=>{
        console.log("Saved new centre",response);
        res.status(200).json({status: "New Health Centre Added to DB"});
    }).catch((error)=>{
        console.error("New health Centre could not be added=>",error);
        res.status(200).json({status: "New Health Centre could not be Added to DB"});
    });
}

router.post("/",verifyjwt.verifyJWT,newHealthCentre);

module.exports = router;
