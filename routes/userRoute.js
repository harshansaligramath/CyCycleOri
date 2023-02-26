const express = require("express");
const user_route = express();
const session = require("express-session");
const nocache = require("nocache");
const blockUser = require('../middleware/blockUser')
const config = require("../config/config");

user_route.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

const auth = require("../middleware/auth");
// const adminAuth = require('../middleware/adminAuth')
user_route.use(express.static('public/user'));

user_route.set("view engine", "ejs");
user_route.set("views", "./views/users");

const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));
user_route.use(nocache());

const userController = require("../controllers/userController");


user_route.get("/",blockUser,userController.loadHome);
user_route.get("/login",blockUser, auth.isLogout, userController.loginLoad);
user_route.post("/login", blockUser,userController.verifyLogin);
user_route.get('/forget',blockUser,userController.loadforget)
user_route.post('/forget',blockUser,userController.verifyforget)
user_route.post('/resetPassword',blockUser,userController.resetPassword)
user_route.get("/logout",blockUser, auth.isLogin, userController.userLogout);

user_route.get("/register",blockUser, auth.isLogout, userController.loadRegister);
// user_route.post("/register", userController.insertUser);
user_route.post("/register",blockUser,userController.loadOtp);
user_route.get('/resendOtp', blockUser,userController.resendOtp)
user_route.post('/verifyOtp',blockUser,userController.verifyOtp)


// user_route.get("/productShow", auth.isLogout, userController.loadProducts);
user_route.get("/productShow",blockUser, userController.loadProducts);
// user_route.get("/", userController.loadBannerDatas);


module.exports = user_route;
