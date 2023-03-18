const Coupons = require("../../models/coupon");
const Orders = require("../../models/orders");
const User = require("../../models/userModel");

const loadUsersProfile = async function (req, res) {
  try {
    const userData = await User.findOne({ _id: req.session.user_id });
    const couponData = await Coupons.find();

    res.render("usersProfileHome", {
      user: req.session.user,
      userData,
      val: "",
      coupon: couponData,
    });
  } catch (error) {
    console.log(error.message);
  }
};


const canselOrder = async (req, res) => {
  try {
    const id = req.query.id;
    console.log("ha ha ha ha ha");
    console.log(id);
    const userData = await Orders.findOne({ _id: id });
    if (userData) {
      const userData = await Orders.findByIdAndUpdate(
        { _id: id },
        { $set: { status: "canseled" } }
      );
      console.log("canseled");
    } else {
      await Orders.findByIdAndUpdate({ _id: id }, { $set: { status: "placed"} });
    }
    console.log("unblocked");
    res.redirect("orders");
  } catch (error) {
    console.log(error);
  }
};



const loadOrders = async function (req, res) {
  try {
    const orderData = await Orders.find({ userId: req.session.user_id }).sort({createdAt:-1});

    res.render("orders", {
      user: req.session.user,
      orders: orderData,
    });
  } catch (error) {
    console.log(error.message);
  }
};


const loadOrderDetails = async (req, res) => {
  console.log("load11111111111");
  try {
    console.log("load22222222");

    const orderData = await Orders.findOne({ _id: req.query.id }).populate(
      "userId"
    );
    console.log("load333333333333");

    const productData = await orderData.populate("products.item.productId");
    res.render("orderDetails", {
      user: req.session.user,
      order: orderData,
      products: productData.products,
    });
    console.log("load44444444444");
  } catch (error) {
    console.log(error.message);
    console.log("load55555555555555555555");
  }
};

module.exports = {
  loadUsersProfile,
  loadOrderDetails,
  loadOrders,
  canselOrder
};
