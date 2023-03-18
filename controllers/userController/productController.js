const Product = require("../../models/product");
const Category = require("../../models/category");
const loadProducts = async (req, res) => {
  try {
      const categoryData = await Category.find()
      let { search, sort, category, limit, page } = req.query
      console.log(search);
      if (!search) {
          search = ''
      }
      if(!page){
          skip=0
      }else{
          skip=page*10
      } 
      console.log(category);
      let arr = []
      if (category) {
          for (i = 0; i < category.length; i++) {
              arr = [...arr, categoryData[category[i]].name]
          }
      } else {
          category = []
          arr = categoryData.map((x) => x.name)
      }
      console.log('sort ' + req.query.sort);
      console.log('category ' + arr);
      if (sort == 0) {
          productData = await Product.find({ is_admin: 0, $and: [{ category: arr }, { $or: [{ name: { $regex: '' + search + ".*" } }, { category: { $regex: ".*" + search + ".*" } }] }] }).sort({$natural:-1}).skip(skip).limit(limit)
      } else {
          productData = await Product.find({ is_admin: 0, $and: [{ category: arr }, { $or: [{ name: { $regex: '' + search + ".*" } }, { category: { $regex: ".*" + search + ".*" } }] }] }).sort({ price: sort }).skip(skip).limit(limit)
      }
      console.log(productData.length + ' results found');
      if (req.session.user) { session = req.session.user } else session = false
      res.render('products', { user: session, products: productData, category: categoryData, val: search, selected: category, order: sort, limit: limit,  })
  } catch (error) {
      console.log(error.message);
  }
}

  //for loading single product page
  const loadSingleProducts = async (req, res) => {
    try {
      const id = req.query.id;
  
      const userData = await Product.findById({ _id: id });
      if (userData) {
        session = req.session.user;
        res.render("singleProductPage", { product: userData,user: session,});
      } else {
        res.redirect("products");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
module.exports = {
    loadProducts,
    loadSingleProducts
};
