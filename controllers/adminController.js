const User = require("../models/userModel");
const Category = require('../models/category')
const Product = require('../models/product')
const bcrypt = require("bcrypt");

const multer = require('multer')
const path =require('path')

let Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
let upload = multer({
  storage: Storage,
}).single("image");



const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);

      if (passwordMatch) {
        if (userData.is_admin === 0) {
          res.render("login", { message: "email and password incorrect" });
        } else {
          req.session.admin_id = userData._id;
          res.redirect("/admin/dashboard");
        }
      } else {
        res.render("login", { message: "email and password is incorrect" });
      }
    } else {
      res.render("login", { message: "email and password is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadDashboard = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.admin_id });
    res.render("dashboard", { admin: userData });
  } catch (error) {
    console.log(error.message);
  }
};

const logout = async (req, res) => {
  try {
    req.session.admin_id = null;
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};


const loadUsers = async (req, res) => {
  try {
    var search = "";
    if (req.query.search) {
      // console.log("re"+req.query);
      search = req.query.search;
      // console.log("search:"+search);
    }
    const userData = await User.find({
      is_admin: 0,
      $or: [
        { name: { $regex: ".*" + search + ".*" } },
        { email: { $regex: ".*" + search + ".*" } },
        { mobile: { $regex: ".*" + search + ".*" } },
      ],
    });
    res.render("users", { users: userData , val: search });
  } catch (error) {
    console.log(error.message);
  }
};
const blockUser = async (req , res) => {
  try {
    const id = req.query.id;
    const userData = await User.findOne({ _id: id });
    if(userData.is_verified){
      const userData = await User.findByIdAndUpdate({_id:id},{$set:{is_verified:0}}); console.log("blocked");
    }else {await User.findByIdAndUpdate({_id:id},{$set:{is_verified:1}});} console.log("unblocked");
    res.redirect("/admin/users");
  } catch (error) {
    console.log(error);
  }
}
const loadCategory = async (req, res) => {
  try {
    var search = "";
    if (req.query.search) {
      search = req.query.search;
    }
    const categoryData = await Category.find({isAvailable:1, name: { $regex: ".*" + search + ".*" } });
    console.log(categoryData);
    res.render("category", { category: categoryData , val: search ,message:undefined });
  } catch (error) {
    console.log(error);
  }
};
const addCategory = async (req, res) => {
  console.log(req.body);
  const categoryData = await Category.findOne( { name: req.body.category})
  const categoryAll =await Category.find()
  console.log(categoryData);
  if(categoryData){
    res.render('category', { category:categoryAll, val:'', message: 'category already Exists'})
  } else{
    try {
      const category = Category({
        name: req.body.category,
      });
      const categoryData = await category.save();
      res.redirect("category");
    } catch (error) {
      console.log(error);
    }
  }
};
const editCategory = async (req,res) => {
try {
  const id = req.query.id
  const category = await  Category.findOne({_id: id})
  if(category){
  const categoryData = await  Category.updateOne({_id: id},{$set: {name:req.body.category}})
  }
} catch (error) {
  console.log(error);
}
}
const deleteCategory = async (req, res) => {
  try {
    const id = req.query.id;
    const catagoryData = await Category.updateOne({_id: id},{$set: {isAvailable:0}})
    
    res.redirect("category");
  } catch (error) {
    console.log(error.message);
  }
};
const loadProducts = async (req, res) => {
  try {
    const productData = await Product.find();
    res.render("product", { products:productData });  
  } catch (error) {
    console.log(error.message);
  }
};
const loadAddProducts = async (req, res) => {
  try {
    const categoryData = await Category.find();
    res.render("addProducts", { category: categoryData });  
  } catch (error) {
    console.log(error.message);
  }
}; 
const addProduct = async (req, res) => {
  try {
    const categoryData = await Category.find();
    console.log(req.file);
    const product = Product({
      name: req.body.name, 
      price: req.body.price,
      description: req.body.description,
      stock: req.body.stock,
      category: req.body.category,
      image:req.file.filename
    });
      console.log(product);
    const productData = await product.save();
    if (productData) {
      res.render("product", {
        message: "registration successfull.",
        category: categoryData,
        products:productData 
      });
    } else {
      res.render("product", { message: "registration failed", products:productData  });
    }
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  loadLogin,
  verifyLogin,
  loadDashboard,
  logout,
  blockUser,
  loadUsers,
  loadProducts,
  loadAddProducts,
  addProduct,
  loadCategory,
  addCategory,
  editCategory,
  deleteCategory,
  upload
};
 



