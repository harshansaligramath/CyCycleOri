const express = require("express")
const admin_route = express();
const session = require("express-session");
const nocache = require("nocache")
const config = require("../config/config");
// const multer = require('../util/multer')

admin_route.use(session({ 
    secret: config.sessionSecret,
    resave:false,
    saveUninitialized:true,    
}));

const auth = require("../middleware/adminAuth");
// const adminController = require("../controllers/adminController");
const bannerController=require("../controllers/adminControllers/bannerController")
const categoryController=require("../controllers/adminControllers/categoryController")
// const dashBoardController=require("../controllers/adminControllers/dashBoardController")
const productController=require("../controllers/adminControllers/productController")
const usersController=require("../controllers/adminControllers/usersController")
const couponController=require("../controllers/adminControllers/couponController")

admin_route.use(express.static('public/admin'));

admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');
admin_route.use(express.json());
admin_route.use(express.urlencoded({ extended: true }));
admin_route.use(nocache());

admin_route.get('/', auth.isLogout, usersController.loadLogin);
admin_route.post('/', usersController.verifyLogin);
admin_route.get('/logout', auth.isLogin, usersController.logout);
admin_route.get('/dashboard', auth.isLogin, usersController.loadDashboard);
admin_route.get('/users', auth.isLogin, usersController.loadUsers);
admin_route.get('/block',usersController.blockUser)
//category
admin_route.get('/category',auth.isLogin, categoryController.loadCategory)
admin_route.get('/addCategory',auth.isLogin, categoryController.loadAddCategories)
admin_route.post('/addCategory',auth.isLogin, categoryController.addCategory)
admin_route.get('/blockCategory',categoryController.blockCategory)
admin_route.get('/deleteCategory',auth.isLogin, categoryController.deleteCategory)
admin_route.get('/editCategory',auth.isLogin, categoryController.editCategoryLoad)
admin_route.post('/edit-category',auth.isLogin, categoryController.editCategory)
//for loading products in admin view file
admin_route.get('/products',auth.isLogin, productController.loadProducts)
//for adding products
admin_route.get('/addProducts',auth.isLogin, productController.loadAddProducts)
admin_route.post('/addProducts',productController.upload.array('image', 10), productController.addProduct)
//for editing products
admin_route.get('/edit-product', auth.isLogin, productController.editUserLoad);
admin_route.post('/edit-product',productController.upload.array('image', 10),productController.editProduct)
//for deleting products
admin_route.get('/blockProduct',productController.blockProduct)
admin_route.get('/delete-product',productController.deleteProduct);
//for loading banners in admin view file
admin_route.get('/banners',auth.isLogin, bannerController.loadBanners)
//for adding banner
admin_route.get('/addBanners',auth.isLogin, bannerController. loadAddBanner)
admin_route.post('/addBanners',bannerController.upload1.array('image', 10), bannerController.addBanner)
//for editing banner
admin_route.get('/edit-banner', auth.isLogin, bannerController.editBannerLoad);
admin_route.post('/edit-banner',bannerController.upload1.array('image', 10),bannerController.editBanner)
//for deleting banner
admin_route.get('/blockBanners',bannerController.blockBanner)
admin_route.get('/delete-banner',bannerController.deleteBanner);
//coupon 


admin_route.get('/coupon',couponController.loadCoupon)
admin_route.post('/addCoupon',couponController.addCoupon)
admin_route.get('/edit-coupon',couponController.editCouponLoad)
admin_route.post('/edit-Coupon',couponController.editCoupon)
admin_route.get('/blockCoupon',couponController.blockCoupon)




admin_route.get('*', function (req, res) {
    res.redirect('/admin');
})


module.exports = admin_route;