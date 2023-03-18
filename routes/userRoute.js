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

// user_route.set("view engine", "ejs");
user_route.set("views", "./views/users");

const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));
user_route.use(nocache());

// const userController = require("../controllers/userController");
const homeController = require("../controllers/userController/homeController");
const authenticationController = require("../controllers/userController/authenticationController");
const productController = require("../controllers/userController/productController");
const wishListController = require("../controllers/userController/wishListController");
const cartController=require("../controllers/userController/cartController")
const checkOutController=require("../controllers/userController/checkOutController")
const usersProfileController=require("../controllers/userController/usersProfileController")


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
// user_route.get("/productShow",blockUser, productController.loadProducts);
user_route.get("/singleProductPage",blockUser, productController.loadSingleProducts);



user_route.get("/addToWishList",blockUser, wishListController.addToWishList);
user_route.get('/deleteFromWishList',wishListController.deleteFromWishlist)
user_route.get('/wishList',wishListController.loadWishList)

 
// user_route.get('/cart',cartController.loadCart)
// user_route.get('/addToCart',cartController.addToCart)
// user_route.get('/removeFromCart',cartController.removeFromCart)

user_route.get('/cart',cartController.loadCart)
user_route.post('/updateCart',cartController.updateCart)
user_route.get('/addToCart',cartController.addToCart)
user_route.get('/removeFromCart',cartController.removeFromCart)
 
// user_route.get("/", homeController.loadHome);
   
   

// user_route.get('/singleCategory',categoryController.loadCategoryPage)
user_route.get('/productShow', productController.loadProducts)

// user_route.get('/checkOut', checkOutController.loadCheckOut) 
// user_route.post('/applyCoupon',checkOutController.applyCoupon)
// user_route.post('/placeOrder', checkOutController.saveDetails) 
// user_route.get('/successCashOnDelivery', checkOutController.successCashOnDelivery) 

 
//for testing purpose 
user_route.get('/checkout',checkOutController.loadCheckout) 
user_route.post('/applyCoupon',checkOutController.applyCoupon)
user_route.post('/placeOrder',checkOutController.placeOrder) 
user_route.get('/orderSuccess',checkOutController.loadSuccess)



user_route.get('/usersProfile',usersProfileController.loadUsersProfile)
// user_route.get('/usersProfileOrders',usersProfileController.loadUsersOrders)

user_route.get('/orders', usersProfileController.loadOrders)
user_route.get('/orderDetails', usersProfileController.loadOrderDetails)
user_route.get('/cancelOrder', usersProfileController.canselOrder)




 
module.exports = user_route;
 