const User = require("../../models/userModel");
const Coupon = require("../../models/coupon");
const Address = require("../../models/address");
const Order=require("../../models/orders")
 

const loadCheckOut = async(req,res)=>{
  try { 
      if(req.session.user_id){
          const userData =await User.findById({ _id:req.session.user_id })
          const cartData = await userData.populate('cart.item.productId')
          console.log("hoiiii");
          console.log(cartData);
          // const addressData = await Address.find({ userId: req.session.user_id })
          const addressData=await Order.findOne({ userId: req.session.user_id })
          const couponData = await Coupon.find()
          console.log(req.query.id);
          if(req.query.id){
           offer = await Coupon.findOne({_id:req.query.id})
          }else{offer = null}
          res.render('checkOutPage',{ user: req.session.user,products:cartData.cart,address:addressData , coupons:couponData , discount:offer})       
      }else{
          res.redirect('/')
      }
  } catch (error) {
      console.log(error.message);
  }
}



const saveDetails = async (req, res) => {
    // const categoryData = await Category.findOne({ name: req.body.category });
    // const categoryAll = await Category.find();
    // console.log(categoryData);
     
      try {
        const order = Order({
            firstname: req.body.firstname,
                          lastname: req.body.lastname,
                          address: req.body.street,
                          city: req.body.city,
                          zip: req.body.pin,
                          mobile: req.body.mno,
        });
        const categoryData = await order.save();
        console.log(categoryData);
        const addressData = await Address.find({ userId: req.session.user_id })
          const couponData = await Coupon.find()
          const userData =await User.findById({ _id:req.session.user_id })
          const cartData = await userData.populate('cart.item.productId')
        res.render("checkOutPage",{ user: req.session.user,products:cartData.cart,address:addressData , coupons:couponData , discount:offer})
      } catch (error) {
        console.log(error);
      }
    
  };
const applyCoupon = async(req,res)=>{
  const couponData = await Coupon.findOne({_id:req.body.id})
  res.send({couponData}) 

}

const successCashOnDelivery = async (req, res) => {
    try {
      res.render("cashOndeliverySuccess",);
    } catch (error) {
      console.log(error.message);
    }
  };


module.exports = {
  loadCheckOut,
//   placeOrder,
saveDetails,
  applyCoupon,
  successCashOnDelivery
};
