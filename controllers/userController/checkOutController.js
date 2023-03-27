const User = require("../../models/userModel");
const Category = require("../../models/category");
const Product = require("../../models/product");
const Address = require("../../models/address");
const Coupon = require("../../models/coupon");
const Order = require("../../models/orders");
const RazorPay = require("razorpay");
const product = require("../../models/product");
require("dotenv").config();

const loadCheckout = async (req, res) => {
  try {
    if (req.session.user_id) {
      console.log("loading checkout page");
      const userData = await User.findById({ _id: req.session.user_id });
      const cartData = await userData.populate("cart.item.productId");
        console.log(userData.wallet);
      const addressData = await Address.find({ userId: req.session.user_id });
      // const selectAddress = await Address.findOne({ _id: id });
      const couponData = await Coupon.find();
      console.log(req.query.id);
      if (req.query.id) {
        offer = await Coupon.findOne({ _id: req.query.id });
      } else {
        offer = null;
      }
      // console.log("5555555555555555");
      // console.log(userData);
      // console.log("5555555555555555");

      res.render("checkOutPage", {
        user: req.session.user,
        userData,
        products: cartData.cart,
        address: addressData,
        coupons: couponData,
        discount: offer,
      });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error.message);
  }
}; 
   
const applyCoupon = async (req, res) => {
  const couponData = await Coupon.findOne({ _id: req.body.id });
  res.send({ couponData });
  // console.log("coupon data starts from here ");
  // console.log(couponData);
  // console.log(".....................");
};

let order;
const placeOrder = async (req, res) => {
  console.log("placing order");

  try {
    if (req.body.address == 0) {
      console.log("placing order1");

      addrData = new Address({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        country: req.body.country,
        address: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.pin,
        mobile: req.body.mno,
      });
    } else {
      console.log("placing order else");

      addrData = await Address.findOne({ _id: req.body.address });
    }

    const couponData = await Coupon.findOne({ _id: req.body.coupon });
    const userData = await User.findOne({ _id: req.session.user_id });
    console.log("placing order 2");

    order = new Order({
      userId: req.session.user_id,
      address: addrData,
      payment: req.body.payment,
      amount: req.body.amount,
      offer: couponData.discount,
      products: userData.cart,
    });
    if (req.body.payment111 == "CODEEEE") {
        // console.log("sssssssss");
        console.log(order.amount);
        console.log(userData.wallet);
        var wallet=userData.wallet-order.amount
        // console.log("...................");
        // console.log(wallet);
    await User.updateOne({ _id: req.session.user_id },{$set:{wallet:wallet}});


    
        // console.log("...................");

        

}
    if (req.body.payment == "COD") {
     for (let key of order.products.item){
           await product.updateOne({_id:key.productId},{$inc:{stock:-key.qty}})
     }
      await order.save();
      await User.updateOne( 
        { _id: req.session.user_id },
        { $unset: { cart: 1 } }
      );
      console.log("order successfull ssss");
      res.render("codSuccess", { user: req.session.user });
    } else {
      console.log("abc");
      var instance = new RazorPay({
        key_id: process.env.KEY_ID,
        key_secret: "0Xht2qgbbCv4USYlv2ZuY5DE",
      });
      console.log("abcdef");
 
      let razorpayOrder = await instance.orders.create({
        amount: req.body.amount * 100,
        currency: "INR",
        receipt: order._id.toString(),
      });
      console.log("abcdefghijkl");

      console.log("order Order created", razorpayOrder);
      res.render("online_pay", {
        userId: req.session.user_id,
        order_id: razorpayOrder.id,
        total: req.body.amount,
        session: req.session,
        key_id: process.env.key_id,
        user: userData,
        order: order,
        orderId: order._id.toString(),
      });
      console.log("dddddddd");
      console.log(order);
    }
  } catch (error) {

    if (req.session.user_id) {
      console.log("loading checkout page");
      const userData = await User.findById({ _id: req.session.user_id });
      const cartData = await userData.populate("cart.item.productId");
        console.log(userData.wallet);
      const addressData = await Address.find({ userId: req.session.user_id });
      // const selectAddress = await Address.findOne({ _id: id });
      const couponData = await Coupon.find();
      console.log(req.query.id);
      if (req.query.id) {
        offer = await Coupon.findOne({ _id: req.query.id });
      } else {
        offer = null;
      }
      // console.log("5555555555555555");
      // console.log(userData);
      // console.log("5555555555555555");

      res.render("checkOutPage", {
        user: req.session.user,
        userData,
        products: cartData.cart,
        address: addressData,
        coupons: couponData,
        discount: offer,
        message:
        "Please check the details are proper",
      });
    }
  
    console.log("4444444444444");
  }
};

const loadSuccess = async (req, res) => {
  console.log("LLLLLLLLLL");
  for (let key of order.products.item){
    await product.updateOne({_id:key.productId},{$inc:{stock:-key.qty}})
}
  await order.save();
  await User.updateOne({ _id: req.session.user_id }, { $unset: { cart: 1 } });
  console.log("order successfull");
  res.render("success", { user: req.session.user });

    // if (order.save) {
    //   console.log("iam the k1111");
    //   // const productDetails = await Product.findOne({ _id:req.session.user_id });
    //   await User.updateOne({ _id: req.session.user_id }, { $unset: { cart: 1 } });

    //   // await Product.updateOne({_id:req.session.user_id},{$set:{stock:{$inc: { stock: -1}}}})
    //   // console.log(order.products.item.qty);
    //   console.log(productDetails);
    //   console.log("iam the k");

    // } else {
    //   console.log("really bad");
    // }
};
module.exports = {
  loadCheckout,
  applyCoupon,
  placeOrder,
  loadSuccess,
};
