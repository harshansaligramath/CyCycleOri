 
const Order = require("../../models/orders");
const User = require("../../models/userModel");

const loadOrders = async (req, res) => {
  try {
    const orderData = await Order.find({}).populate("userId").sort({createdAt:-1});
    console.log("orders");
    res.render("orders", {
      message: undefined,
      val: "",
      orders: orderData,
    });
  } catch (error) {
    console.log(error.message);
  }
};    
const loadOrderDetails = async (req, res) => {
  try {
    const orderData = await Order.findOne({ _id: req.query.id }).populate(
      "userId"
    );
    const userData = await orderData.populate("userId");
    const productData = await orderData.populate("products.item.productId");
    console.log("orderdetails");
    res.render("orderDetails", {
      message: undefined,
      val: "",
      order: orderData,
      user: userData,
      products: productData.products,
    });
  } catch (error) {
    console.log(error.message);
  }
};  
const changeStatus = async (req, res) => {
  try {
    console.log("enjoyyyyyyy");
    console.log(req.body.id);
    await Order.updateOne({ _id: req.body.id }, { status: req.body.status });
    const orderData = await Order.findOne({ _id: req.body.id });
    console.log(req.body.status); 
    if (req.body.status == "Cancelled" && orderData.payment != "COD") {
      const userData = await User.findOne({ _id: orderData.userId });
      await User.updateOne(
        { _id: orderData.userId },
        { $set: { wallet: userData.wallet + orderData.amount } }
      );
      console.log(userData, userData.wallet);
    } 
    if (orderData) {
      console.log(orderData);
      res.send({ state: 1 });
    }
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  loadOrders,
  loadOrderDetails,
  changeStatus
};
 