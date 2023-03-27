 
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
    if (req.body.status == "Cancelled" && orderData.payment != "COD" ) {
      const userData = await User.findOne({ _id: orderData.userId });
      await User.updateOne(
        { _id: orderData.userId },
        { $set: { wallet: userData.wallet + orderData.amount } }
      );
      console.log("allkooooooooooooo");
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
// const loadOrders1 = async (req, res) => {
//   try {
//     const orderData = await Order.find({}).populate("userId").sort({createdAt:-1});
//     console.log("orders");
//     res.render("orders", { 
//       message: undefined,
//       val: "",
//       orders: orderData,
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// };    
const salesReport = async (req, res) => {
  try {
  console.log("sales report page");
  
  expiryDate=req.body.expiryDate
  startingDate=req.body.startingDate
  const orderData = await Order.find({createdAt:{$gte:startingDate,$lte:expiryDate}}).populate("userId").sort({createdAt:-1});

   
    res.render("salesReport",{orders: orderData,message: undefined,
      val: "",
    });
  } catch (error) {
    console.log(error.message);
  }
};
const salesReportPost = async (req, res) => {
  try {
  console.log("sales report page11");

    expiryDate=req.body.expiryDate
    startingDate=req.body.startingDate
    console.log(startingDate);
    console.log("ouuuuuucchhhhhhhh");
    console.log(expiryDate);
    const orderData = await Order.find({createdAt:{$gte:startingDate,$lte:expiryDate}}).populate("userId").sort({createdAt:-1});
    console.log(orderData);
    res.render("salesReport", {
      message: undefined,
      val: "",
      orders: orderData,
    });
  } catch (error) {
    console.log(error.message);
  }
};  
module.exports = {
  loadOrders,
  loadOrderDetails,
  changeStatus,
  salesReport,
  salesReportPost
};
 