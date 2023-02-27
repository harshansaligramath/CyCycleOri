const Product = require("../../models/product");

const loadProducts = async (req, res) => {
    try {
      // productData = await Product.find();
      const productData=await Product.find({isAvailable:1})
  
      console.log(productData);
      if (req.session.user) {
        session = req.session.user;
      } else session = false;
      res.render("products", { user: session, product: productData });
    } catch (error) {
      console.log(error.message);
    }
  }; 
module.exports = {
    loadProducts
};
