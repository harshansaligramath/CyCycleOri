const Banner = require("../../models/banner");
const multer = require("multer");
const path = require("path");

let Storage1 = multer.diskStorage({
    // destination: "./public/admin/banner/",
    destination: "./public/admin/banner/",

    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "_" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  let upload1 = multer({
    storage: Storage1,
  })
  
//rendering banner  page in admin page
const loadBanners = async (req, res) => {
    try {
      const bannerData = await Banner.find();
      res.render("banner", { banners: bannerData });
    } catch (error) {
      console.log(error.message);
    }
  };


  //getting add banner page in admin page
const loadAddBanner = async (req, res) => {
    try {
      res.render("addBanner",);
    } catch (error) {
      console.log(error.message);
    }
  };

  //saving banner details in admin page file post

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


  
// editing page load banner method get

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
  
//editing page load banner method post
  
  
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
          banners: productData,
          active: 4,
        });
      } else {
        res.render("banner", {
          message: "registration failed",
          banners: productData,
          active: 4,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //delete banner
const deleteBanner = async (req, res) => {
    try {
      const id = req.query.id;
      await Banner.deleteOne({ _id: id });
      res.redirect("/admin/dashboard");
    } catch (error) {
      console.log(error.message);
    }
  };
  
  // block product
const blockBanner = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Banner.findOne({ _id: id });
    if (userData.isAvailable ==1) {
      const userData = await Banner.findByIdAndUpdate(
        { _id: id },
        { $set: { isAvailable:0 } }
      );
      console.log("blocked");
    } else {
      await Banner.findByIdAndUpdate({ _id: id }, { $set: { isAvailable: 1} });
    }
    console.log("unblocked");
    res.redirect("/admin/banner");
  } catch (error) {
    console.log(error);
  }
};

  
module.exports = {

    loadBanners,
    loadAddBanner,
    upload1,
    addBanner,
    editBannerLoad,
    editBanner,
    deleteBanner,
    blockBanner
  
};
