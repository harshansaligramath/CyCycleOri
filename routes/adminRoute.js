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
const adminController = require("../controllers/adminController");
admin_route.use(express.static('public/admin'));

admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');
admin_route.use(express.json());
admin_route.use(express.urlencoded({ extended: true }));
admin_route.use(nocache());

admin_route.get('/', auth.isLogout, adminController.loadLogin);

admin_route.post('/', adminController.verifyLogin);

admin_route.get('/logout', auth.isLogin, adminController.logout);

admin_route.get('/dashboard', auth.isLogin, adminController.loadDashboard);

admin_route.get('/users', auth.isLogin, adminController.loadUsers);
admin_route.get('/block',adminController.blockUser)

admin_route.get('/category',auth.isLogin, adminController.loadCategory)
admin_route.get('/addCategory',auth.isLogin, adminController.loadAddCategories)
admin_route.post('/addCategory',auth.isLogin, adminController.addCategory)
admin_route.get('/blockCategory',adminController.blockCategory)

admin_route.get('/deleteCategory',auth.isLogin, adminController.deleteCategory)
admin_route.get('/editCategory',auth.isLogin, adminController.editCategoryLoad)
admin_route.post('/edit-category',auth.isLogin, adminController.editCategory)

//for loading products in admin view file
admin_route.get('/products',auth.isLogin, adminController.loadProducts)
//for adding products
admin_route.get('/addProducts',auth.isLogin, adminController.loadAddProducts)
admin_route.post('/addProducts',adminController.upload.array('image', 10), adminController.addProduct)
//for editing products

admin_route.get('/edit-product', auth.isLogin, adminController.editUserLoad);
admin_route.post('/edit-product',adminController.upload.array('image', 10),adminController.editProduct)
//for deleting products
admin_route.get('/blockProduct',adminController.blockProduct)
admin_route.get('/delete-product',adminController.deleteProduct);

//for loading banners in admin view file
admin_route.get('/banners',auth.isLogin, adminController.loadBanners)
//for adding banner
admin_route.get('/addBanners',auth.isLogin, adminController. loadAddBanner)
admin_route.post('/addBanners',adminController.upload1.array('image', 10), adminController.addBanner)
//for editing banner


admin_route.get('/edit-banner', auth.isLogin, adminController.editBannerLoad);
admin_route.post('/edit-banner',adminController.upload1.array('image', 10),adminController.editBanner)
//for deleting banner
admin_route.get('/delete-banner',adminController.deleteBanner);






admin_route.get('*', function (req, res) {
    res.redirect('/admin');
})


module.exports = admin_route;