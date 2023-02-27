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

// const userController = require("../controllers/userController");
const homeController = require("../controllers/userController/homeController");
const authenticationController = require("../controllers/userController/authenticationController");
const productController = require("../controllers/userController/productController");


user_route.get("/",blockUser,homeController.loadHome);
user_route.get("/login",blockUser, auth.isLogout, authenticationController.loginLoad);
user_route.post("/login", blockUser,authenticationController.verifyLogin);
user_route.get('/forget',blockUser,authenticationController.loadforget)
user_route.post('/forget',blockUser,authenticationController.verifyforget)
user_route.post('/resetPassword',blockUser,authenticationController.resetPassword)
user_route.get("/logout",blockUser, auth.isLogin, authenticationController.userLogout);
user_route.get("/register",blockUser, auth.isLogout, authenticationController.loadRegister);
// user_route.post("/register", userController.insertUser);
user_route.post("/register",blockUser,authenticationController.loadOtp);
user_route.get('/resendOtp', blockUser,authenticationController.resendOtp)
user_route.post('/verifyOtp',blockUser,authenticationController.verifyOtp)
// user_route.get("/productShow", auth.isLogout, userController.loadProducts);
user_route.get("/productShow",blockUser, productController.loadProducts);
// user_route.get("/", userController.loadBannerDatas);


module.exports = user_route;
