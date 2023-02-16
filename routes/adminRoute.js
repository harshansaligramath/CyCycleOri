const express = require("express")
const admin_route = express();
const session = require("express-session");
const nocache = require("nocache")
const config = require("../config/config");
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
admin_route.post('/category',auth.isLogin, adminController.addCategory)
admin_route.get('/deleteCategory',auth.isLogin, adminController.deleteCategory)
admin_route.get('/editCategory',auth.isLogin, adminController.editCategory)
admin_route.get('/products',auth.isLogin, adminController.loadProducts)
admin_route.get('/addProducts',auth.isLogin, adminController.loadAddProducts)
admin_route.post('/addProducts',adminController.upload,adminController.addProduct)

admin_route.get('*', function (req, res) {
    res.redirect('/admin');
})


module.exports = admin_route;