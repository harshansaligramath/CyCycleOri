const User = require("../models/userModel");
const Category = require("../models/category");
const Product = require("../models/product");
const Banner = require("../models/banner");
const bcrypt = require("bcrypt");

const multer = require("multer");
const path = require("path");

let Storage = multer.diskStorage({
  destination: "./public/admin/uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
let upload = multer({
  storage: Storage,
});

// let Storage1 = multer.diskStorage({
//   destination: "./public/admin/banner/",
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.fieldname + "_" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });
// let upload1 = multer({
//   storage: Storage1,
// })

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
    res.render("users", { users: userData, val: search });
  } catch (error) {
    console.log(error.message);
  }
};
const blockUser = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await User.findOne({ _id: id });
    if (userData.is_verified) {
      const userData = await User.findByIdAndUpdate(
        { _id: id },
        { $set: { is_verified: 0 } }
      );
      console.log("blocked");
    } else {
      await User.findByIdAndUpdate({ _id: id }, { $set: { is_verified: 1 } });
    }
    console.log("unblocked");
    res.redirect("/admin/users");
  } catch (error) {
    console.log(error);
  }
};

const loadCategory = async (req, res) => {
  try {
    var search = "";
    if (req.query.search) {
      // console.log("re"+req.query);
      search = req.query.search;
      // console.log("search:"+search);
    }
    const userData = await Category.find({
     
      $or: [
        { name: { $regex: ".*" + search + ".*" } },
       
      ],
    });
    res.render("category", { users: userData, val: search });
  } catch (error) {
    console.log(error.message);
  }
};

// const loadCategory = async (req, res) => {
//   try {
//     const categoryData = await Category.find({isAvailable:1});
//     res.render("category", { category: categoryData });
//   } catch (error) {
//     console.log(error);
//   }
// };

//block category
const blockCategory = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Category.findOne({ _id: id });
    if (userData.isAvailable ==1) {
      const userData = await Category.findByIdAndUpdate(
        { _id: id },
        { $set: { isAvailable: 0 } }
      );
      console.log("blocked");
    } else {
      await Category.findByIdAndUpdate({ _id: id }, { $set: { isAvailable: 1 } });
    }
    console.log("unblocked");
    res.redirect("/admin/category");
  } catch (error) {
    console.log(error);
  }
};

//for loading categories in admin view file get
const loadAddCategories = async (req, res) => {
  try {
    const categoryData = await Category.find();
    res.render("addCategory", { category: categoryData });
  } catch (error) {
    console.log(error.message);
  }
};
//for adding categories in admin view file post

const addCategory = async (req, res) => {
  const categoryData = await Category.findOne({ name: req.body.category });
  const categoryAll = await Category.find();
  console.log(categoryData);
  if (!categoryData) {
    res.render("addCategory", {
      category: categoryAll,
      val: "",
      message: "category already Exists",
    });
  } else {
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

//edit category


const editCategoryLoad = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Category.findById({ _id: id });
    if (userData) {
      res.render("editCategory", { category: userData, });
    } else {
      res.redirect("category");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const editCategory = async (req, res) => {
  try {
    id=req.query.id;
    const nCat= req.body.category;
    const catagoryData = await Category.updateOne({_id:id},{$set:{name:nCat}});
    // if(catagoryData){await Category.save();}
    res.redirect("admin/category");
    
  } catch (error) {
    console.log(error.message);
  }
}
const deleteCategory = async (req, res) => {
  try {
    const id = req.query.id;
    const catagoryData = await Category.updateOne(
      { _id: id },
      { $set: { isAvailable: 0 } }
    );

    res.redirect("category");
  } catch (error) {
    console.log(error.message);
  }
};

//for loading products in admin view file

const loadProducts = async (req, res) => {
  try {
    var search = "";
    if (req.query.search) {
      search = req.query.search;
    }
    const productData = await Product.find({});

    res.render("product", { products: productData,val: search });
  } catch (error) {
    console.log(error.message);
  }
};
//for loading products in admin view file get
const loadAddProducts = async (req, res) => {
  try {
    const categoryData = await Category.find();
    res.render("addProducts", { category: categoryData });
  } catch (error) {
    console.log(error.message);
  }
};
//for loading products in admin view file post

const addProduct = async (req, res) => {
  try {
    const categoryData = await Category.find();
    console.log(req.files);
    const product = Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      stock: req.body.stock,
      category: req.body.category,
      image: req.files.map((x)=>x.filename),
    });
    console.log(product);
    const productData = await product.save();
    if (productData) {
      res.render("product", {
        message: "registration successfull.",
        category: categoryData,
        products: productData,
      });
    } else {
      res.render("product", {
        message: "registration failed",
        products: productData,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//for editing products method get

const editUserLoad = async (req, res) => {
  try {
    const id = req.query.id;
    const category = await Category.find();

    const userData = await Product.findById({ _id: id });
    if (userData) {
      res.render("editProducts", { product: userData, category: category });
    } else {
      res.redirect("editProducts");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const editProduct = async (req, res) => {
  try {
    console.log(req.files);
    if (req.files.length != 0) {
      product = await Product.updateOne(
        { _id: req.query.id },
        {
          $set: {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            stock: req.body.stock,
            category: req.body.category,
            image: req.files.map((x) => x.filename),
          },
        }
      );
    } else {
      product = await Product.updateOne(
        { _id: req.query.id },
        {
          $set: {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            stock: req.body.stock,
            category: req.body.category,
          },
        }
      );
    }
    console.log(product);
    const productData = await Product.find();
    if (product) {
      res.render("product", {
        message: "registration successfull.",
        products: productData,
        active: 4,
      });
    } else {
      res.render("product", {
        message: "registration failed",
        products: productData,
        active: 4,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};


// block product
const blockProduct = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Product.findOne({ _id: id });
    if (userData.isAvailable ==1) {
      const userData = await Product.findByIdAndUpdate(
        { _id: id },
        { $set: { isAvailable:0 } }
      );
      console.log("blocked");
    } else {
      await Product.findByIdAndUpdate({ _id: id }, { $set: { isAvailable: 1} });
    }
    console.log("unblocked");
    res.redirect("/admin/product");
  } catch (error) {
    console.log(error);
  }
};
// const blockCategory = async (req, res) => {
//   try {
//     const id = req.query.id;
//     const userData = await Category.findOne({ _id: id });
//     if (userData.isAvailable ==1) {
//       const userData = await Category.findByIdAndUpdate(
//         { _id: id },
//         { $set: { isAvailable: 0 } }
//       );
//       console.log("blocked");
//     } else {
//       await Category.findByIdAndUpdate({ _id: id }, { $set: { isAvailable: 1 } });
//     }
//     console.log("unblocked");
//     res.redirect("/admin/category");
//   } catch (error) {
//     console.log(error);
//   }
// };

//delete product
const deleteProduct = async (req, res) => {
  try {
    const id = req.query.id;
    await Product.deleteOne({ _id: id });
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};
const updateUser = async (req, res) => {
  try {
    const categoryData = await Category.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          name: req.body.name,
          category: req.body.category,
          description: req.body.description,
          price: req.body.price,
          stock: req.body.stock,
          image: req.body.image,
        },
      }
    );
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};
//for loading products in admin view file
const loadBanners = async (req, res) => {
  try {
    const bannerData = await Banner.find();
    res.render("banner", { banners: bannerData });
  } catch (error) {
    console.log(error.message);
  }
};
//for loading products in admin view file get
const loadAddBanner = async (req, res) => {
  try {
    res.render("addBanner",);
  } catch (error) {
    console.log(error.message);
  }
};
//for loading products in admin view file post

const addBanner = async (req, res) => {
  try {
    // const categoryData = await Category.find();
    console.log(req.file);
    const product = Banner({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.files.map((x) => x.filename),
    });
    console.log(product);
    const productData = await product.save();
    if (productData) {
      res.render("dashboard", {
        message: "registration successfull.",
        products: productData,
      });
    } else {
      res.render("banner", {
        message: "registration failed",
        products: productData,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//for editing banner method get

const editBannerLoad = async (req, res) => {
  try {
    const id = req.query.id;

    const userData = await Banner.findById({ _id: id });
    if (userData) {
      res.render("editBanner", { product: userData});
    } else {
      res.redirect("editBanner");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const editBanner = async (req, res) => {
  try {
    if (req.files.length != 0) {
      product = await Banner.updateOne(
        { _id: req.query.id },
        {
          $set: {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.files.map((x) => x.filename),
          },
        }
      );
    } else {
      product = await Banner.updateOne(
        { _id: req.query.id },
        {
          $set: {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.files.map((x) => x.filename),

          },
        }
      );
    }
    console.log(product);
    const productData = await Banner.find();
    if (product) {
      res.render("banner", {
        message: "registration successfull.",
        products: productData,
        active: 4,
      });
    } else {
      res.render("banner", {
        message: "registration failed",
        products: productData,
        active: 4,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//delete product
const deleteBanner = async (req, res) => {
  try {
    const id = req.query.id;
    await Banner.deleteOne({ _id: id });
    res.redirect("/admin/dashboard");
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
  upload,
  // upload1,
  editUserLoad,
  updateUser,
  editProduct,
  deleteProduct,
  //banners
  loadBanners,
  loadAddBanner,
  addBanner,
  editBannerLoad,
  editBanner,
  deleteBanner,
  editCategoryLoad,
  loadAddCategories,
  blockCategory,
  blockProduct,

};
