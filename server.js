const express = require('express');
const ejs = require('ejs');
const session = require('express-session');
const passport = require('./passport');
const {
    User
} = require('./db')
const app = express();

app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use(session({
    secret: 'some very very secret thing',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', express.static(__dirname + '/public', {
    index: 'signin.html'
}));

app.post('/signup', (req, res) => {
    User.findOne({
        where:{
            id: req.body.id
        }            
        })
        .then((currentUser) => {     
            if(!(currentUser)){id: req.body.id
                User.create({
                    name: req.body.name,
                    id: req.body.id,
                    password: req.body.password
                }).then((registeredUser) => {
                    console.log("gggggggggg", registeredUser)
                    if (registeredUser) {
                        res.status(200).send({
                            success:true,
                            message:"Registered Successfully",
                            redirectUrl:'signin.html'
                        })
                    }
                }).catch((err) => {
                    res.status(500).send({
                        success: false,
                        message: "Error in Registration"
                    })
                })
            }
            else{
                res.status(500).send({
                    success: false,
                    message: "You are Already Registered"
                })
            }
        })
        .catch((error) => {
            res.status(500).send({
                success: false,
                message: "Oops! Something is not right! Try after some time."
            })         
        })
});
app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin.html',
    successRedirect: '/product/productlist',
}))
app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});
app.use('/vendor', require('./routes/vendor'));
app.use('/product', require('./routes/product'));
app.use(redirectUnmatched); 
function redirectUnmatched(req, res) {
    res.redirect("/");
}
app.listen(4444,()=>{
    console.log("Server Start");
});