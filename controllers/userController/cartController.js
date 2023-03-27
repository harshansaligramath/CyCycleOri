const User = require("../../models/userModel");
const Product = require("../../models/product");

const loadCart = async (req, res) => {
  try {
    if (req.session.user_id) {
      const userData = await User.findById({ _id: req.session.user_id });
      const cartData = await userData.populate("cart.item.productId");
      // console.log("ooooooooooooooooooooooooooooo");
      console.log(cartData);
      res.render("cart", { user: session, products: cartData.cart });
    } else {
      res.render("login");

      // res.render('cart', { user: session,products:null })
    }
  } catch (error) {
    console.log(error);
  }
};
const updateCart = async (req, res) => {
  try {
    let { quantity, _id } = req.body;
    const userData = await User.findById({ _id: req.session.user_id });
    const total = await userData.updateCart(_id, quantity);
    console.log(quantity, _id);
    // console.log(total);
    res.json({ total });
  } catch (error) {
    console.log(error);
  }
};
const addToCart = async (req, res) => {
  try {
    console.log("cart control loading....");

    const productId = req.query.id;
    console.log("proid" + productId);
    userSession = req.session.user_id;
    console.log("cart control loading....");
    // console.log(userSession);
    if (userSession) {
      const userData = await User.findById({ _id: req.session.user_id });
      const productData = await Product.findById({ _id: productId });
      console.log("55555555555555555");
      console.log(productData.stock);
      console.log("55555555555555555");
      if (productData.stock > 0) {
        userData.addToCart(productData);
      } else {
        res.render("errorpageCart");
      }

      res.redirect("/cart");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
  }
};
const removeFromCart = async (req, res) => {
  const productId = req.query.id;
  const userData = await User.findById({ _id: req.session.user_id });
  userData.removefromCart(productId);
  res.redirect("/cart");
};
module.exports = {
  updateCart,
  addToCart,
  removeFromCart,
  loadCart,
};
