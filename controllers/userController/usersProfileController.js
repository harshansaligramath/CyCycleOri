// const Coupons = require("../../models/coupon");
// const Orders = require("../../models/orders");
// const User = require("../../models/userModel");

// const loadUsersProfile = async function (req, res) {
//   try {
//     const userData = await User.findOne({ _id: req.session.user_id });
//     const couponData = await Coupons.find();

//     res.render("usersProfileHome", {
//       user: req.session.user,
//       userData,
//       val: "",
//       coupon: couponData,
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// };


// const canselOrder = async (req, res) => {
//   try {
//     const id = req.query.id;
//     console.log("ha ha ha ha ha");
//     console.log(id);
//     const userData = await Orders.findOne({ _id: id });
//     if (userData) {
//       const userData = await Orders.findByIdAndUpdate(
//         { _id: id },
//         { $set: { status: "canseled" } }
//       );
//       console.log("canseled");
//     } else {
//       await Orders.findByIdAndUpdate({ _id: id }, { $set: { status: "placed"} });
//     }
//     console.log("unblocked");
//     res.redirect("orders");
//   } catch (error) {
//     console.log(error);
//   }
// };



// const loadOrders = async function (req, res) {
//   try {
//     const orderData = await Orders.find({ userId: req.session.user_id }).sort({createdAt:-1});

//     res.render("orders", {
//       user: req.session.user,
//       orders: orderData,
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// };


// const loadOrderDetails = async (req, res) => {
//   console.log("load11111111111");
//   try {
//     console.log("load22222222");

//     const orderData = await Orders.findOne({ _id: req.query.id }).populate(
//       "userId"
//     );
//     console.log("load333333333333");

//     const productData = await orderData.populate("products.item.productId");
//     res.render("orderDetails", {
//       user: req.session.user,
//       order: orderData,
//       products: productData.products,
//     });
//     console.log("load44444444444");
//   } catch (error) {
//     console.log(error.message);
//     console.log("load55555555555555555555");
//   }
// };

// module.exports = {
//   loadUsersProfile,
//   loadOrderDetails,
//   loadOrders,
//   canselOrder
// };



const User = require('../../models/userModel')
const Product = require('../../models/product')
const Address = require('../../models/address')
const Orders = require('../../models/orders')
const Coupon = require('../../models/coupon')
const loadDash = async (req, res) => {
    try {
        if(req.session.user){
        const userData = await User.findOne({_id:req.session.user_id})  
        const orderData = await Orders.find({ userId: req.session.user_id })
        
        res.render('dashboard', { user: req.session.user,userData,orderData})
        console.log("allllllllll");
        console.log(orderData);
        console.log("allllllllll");

    }else{
        res.redirect('login')
    }
    }catch (error) {
        console.log(error.message)
    }
}

const saveAddress = async(req,res)=>{
    try {
      const addressData = new Address({
        userId:req.session.user_id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        country: req.body.country,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.pin,
        mobile: req.body.mno,
      })
       await addressData.save();
       res.redirect('/address');
  
  
    } catch (error) {
      console.log(error.message)
    }
  }
 
  const loadEditAddress = async(req,res)=>{
    try {
      console.log("load edit address page");
      const id = req.query.id;

      const addressData = await Address.findById({ _id: id });
      
       res.render('editAddress',{addressData:addressData});
  
  
    } catch (error) {
      console.log(error.message)
    }
  }
  const editAddress = async(req,res)=>{
    try {
      const addressData = await Address.updateOne({_id:req.body.id},{$set:{
        userId:req.session.user_id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        country: req.body.country,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.pin,
        mobile: req.body.mno,
     } })
     console.log("edit address success");
       res.redirect('/address');
  
  
    } catch (error) {
      console.log(error.message)
    }
  }
  const deleteAddress = async (req, res) => {
    try {
        if(req.session.user){
        const addressData = await Address.deleteOne({_id: req.query.id})
        res.redirect('/address');
        }else{
        res.redirect('login')
    }
    }catch (error) {
        console.log(error.message)
    }
}

  // const loadOrders = async function (req,res) {
  //   try {
  //       const orderData = await Orders.find({ userId: req.session.user_id })
  //       res.render('orders',{active:2,user: req.session.user, orders:orderData, head: 5})
  //   } catch (error) {
  //       console.log(error.message);
  //   } 
  // }
  const loadOrderDetails = async (req,res)=>{
    try {
      const orderData = await Orders.findOne({_id:req.query.id}).populate('userId')
      const productData = await orderData.populate('products.item.productId')
      res.render('orderDetails',{user: req.session.user, order:orderData, products:productData.products})
      
    } catch (error) {
      console.log(error.message);
    }
  } 
  
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
    res.redirect("dashboard");
  } catch (error) {
    console.log(error);
  }
};
const loadAddress = async (req, res) => {
  try {
      if(req.session.user){
      const addressData = await Address.find({ userId: req.session.user_id })
      res.render('manageAddress', { user: req.session.user,address:addressData })
  }else{
      res.redirect('login')
  }
  }catch (error) {
      console.log(error.message)
  }
}
  
  // const loadProfile = async function (req,res) {
  //   try {
  //       const userData = await User.findOne({_id:req.session.user_id})
  //       res.render('users/profile',{active:4,user: req.session.user, head: 5,userData})
  //   } catch (error) {
  //       console.log(error.message);
  //   }
  // }
module.exports = {
    loadDash,
    loadOrderDetails,
    canselOrder,
    loadAddress,
    saveAddress,
    editAddress,
    deleteAddress,
    loadEditAddress
    
}