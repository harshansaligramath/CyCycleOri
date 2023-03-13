const Product = require("../../models/product");
const Category = require("../../models/category");

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

//for loading products in admin view file

const loadProducts = async (req, res) => {
  try {
    var search = "";
    if (req.query.search) {
      search = req.query.search;
    }
    const productData = await Product.find({});

    res.render("product", { products: productData, val: search });
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
    if (req.files.length != 0) {
      const product = Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        stock: req.body.stock,
        category: req.body.category,
        image: req.files.map((x) => x.filename),
      });
      console.log(product);
      await product.save();
      const productData = await Product.find();
      if (product) {
        res.render("product", {
          message: "registration successfull.",
          products: productData,
          active: 4,
        });
      } else {
        res.render("addProducts", {
          message: "registration failed",
          category: categoryData,
          active: 4,
        });
      }
    } else {
      res.render("addProducts", {
        message: "registration failed only jpg ,jpeg & png file supported !",
        category: categoryData,
        active: 4,
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
      const productDetails = await Product.findOne({ _id: req.query.id });
      const oldImg = productDetails.image;
      const newImg = req.files.map((x) => x.filename);
      const images = oldImg.concat(newImg);
      console.log(images);
      product = await Product.updateOne(
        { _id: req.query.id },
        {
          $set: {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            stock: req.body.stock,
            category: req.body.category,
            image: images,
          },
        }
      );
    } else {
      // console.log("kopp images");

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
    if (productData) {
      res.render("product", {
        message: "registration successfull.",
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

// block product
const blockProduct = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Product.findOne({ _id: id });
    if (userData.isAvailable == 1) {
      const userData = await Product.findByIdAndUpdate(
        { _id: id },
        { $set: { isAvailable: 0 } }
      );
      console.log("blocked");
      res.redirect("/admin/product");
      console.log("koppp");
    } else {
      await Product.findByIdAndUpdate(
        { _id: id },
        { $set: { isAvailable: 1 } }
      );
    }
    console.log("unblocked");
    res.redirect("/admin/product");
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.query.id;
    await Product.deleteOne({ _id: id });
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

const updateImage = async (req, res) => {
  try {
    let { pId, img } = req.body;
    console.log(pId, img);
    await Product.updateOne({ _id: pId }, { $pull: { image: img } });
    const productData = Product.findOne({ _id: pId });
    console.log(productData);
    res.send({ newImage: productData.image });
  } catch (error) {
    console.log(error.message);
  }
};
const uploadImage = async (req, res) => {
  try {
    console.log(req.files);
    const productDetails = await Product.findOne({ _id: req.body.pId });
    const oldImg = productDetails.image;
    const newImg = req.files.map((x) => x.filename);
    const images = oldImg.concat(newImg);
    console.log(images);
    await Product.updateOne({ _id: req.body.pId }, { $set: { image: images } });
    const productData = await Product.findOne({ _id: req.body.pId });
    console.log(productData.image);
    res.json({ newImage: productData.image });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  upload,
  loadProducts,
  loadAddProducts,
  addProduct,
  editUserLoad,
  editProduct,
  blockProduct,
  deleteProduct,
  updateImage,
  uploadImage,
};
