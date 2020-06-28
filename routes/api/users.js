const express = require('express');
const router = express.Router();
const User = require('../../models/Users');

const keys = require('../../config/keys');
const jwt = require('jsonwebtoken');

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// @route GET api/users/test
// @desc Test users route
// access  public

router.get('/test',(req,res)=> res.json({ msg: "User works"}));

router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(user){
                return res.status(400).json({email: 'This email is already registered'});
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // size
                    r: 'pg', //rating
                    d: 'mm' // Default
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser
                        .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        });
});

// @route GET api/users/login
// @desc Test users login
// access  public

router.post('/login',(req,res) =>{
    const email = req.body.email;
    const password = req.body.password;

    // find user by email
    User.findOne({email}).then(user => {

    // check for user
        if(!user){
            return res.status(404).json({email:'User not Found'});
        }

    //  check for password

    bcrypt.compare(password,user.password).then(ismatch =>{
        if(ismatch){
            // User Matched
            const payload = {id: user.id, name: user.name, avatar: user.avatar};

            // Sign Token
            jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
                res.json({
                    success: true,
                    token: "Brearer " + token,
                });
            });
        } else {
            res.status(400).json({password:'password incorrect'})
        }

    });

    });

});
// @route GET api/users/current 
// @desc return current user
// access  private 

router.get('/current',passport.authenticate('jwt', {session: false}),
(req,res) =>{
    res.json({id :req.user.id,
            name : req.user.name,
            email : req.user.email});

});


module.exports = router;