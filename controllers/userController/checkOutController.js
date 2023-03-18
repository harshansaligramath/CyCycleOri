

const User = require('../../models/userModel')
const Category = require('../../models/category')
const Product = require('../../models/product')
const Address = require('../../models/address')
const Coupon = require('../../models/coupon')
const Order = require('../../models/orders')
const RazorPay = require('razorpay')
require("dotenv").config(); 



const loadCheckout = async(req,res)=>{
    try {
        if(req.session.user_id){
            console.log("loading checkout page");
            const userData =await User.findById({ _id:req.session.user_id })
            const cartData = await userData.populate('cart.item.productId')
            
            const addressData = await Address.find({ userId: req.session.user_id })
            // const selectAddress = await Address.findOne({ _id: id });
            const couponData = await Coupon.find()
            console.log(req.query.id);
            if(req.query.id){
             offer = await Coupon.findOne({_id:req.query.id})
            }else{offer = null}
            res.render('checkOutPage',{ user: req.session.user,userData, products:cartData.cart,address:addressData , coupons:couponData , discount:offer})       
        }else{
            res.redirect('/')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const applyCoupon = async(req,res)=>{
    
    const couponData = await Coupon.findOne({_id:req.body.id})
    res.send({couponData}) 
    console.log("coupon data starts from here ");

}



let order
const placeOrder = async(req,res)=>{
    console.log("placing order");
 
    try {
        if(req.body.address==0){
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
            })
        }else{
    console.log("placing order else");

            addrData= await Address.findOne({_id: req.body.address})
        }

        const couponData = await Coupon.findOne({_id:req.body.coupon})
        const userData = await User.findOne({_id:req.session.user_id})
    console.log("placing order 2");

        order = new Order({
            
            userId:req.session.user_id,
            address:addrData,
            payment:req.body.payment,
            amount: req.body.amount,
            offer:couponData.discount,
            products:userData.cart
        })
        console.log(order);
        if(req.body.payment=='COD'){
            await order.save(); 
            await User.updateOne({_id:req.session.user_id},{$unset:{cart:1}})
            console.log('order successfull ssss');
            res.render('codSuccess',{user:req.session.user});
        }else{
            console.log("abc");
            var instance = new RazorPay({
                key_id:process.env.KEY_ID,
                key_secret:"0Xht2qgbbCv4USYlv2ZuY5DE"
              })
            console.log("abcdef");

              let razorpayOrder = await instance.orders.create({
                amount: req.body.amount*100,
                currency:'INR',
                receipt:order._id.toString()
              }) 
            console.log("abcdefghijkl");

              console.log('order Order created', razorpayOrder);
              res.render("online_pay", {
                userId:req.session.user_id,
                order_id:razorpayOrder.id,
                total:  req.body.amount,
                session: req.session,
                key_id: process.env.key_id,
                user: userData,
                order: order,
                orderId: order._id.toString()   
              });
              console.log("dddddddd");
              console.log(order);
        }
        
    } catch (error) {
        console.log(error.message);
    }
}
 
const loadSuccess = async (req,res)=>{
    console.log("LLLLLLLLLL");
    await order.save(); 
    await User.updateOne({_id:req.session.user_id},{$unset:{cart:1}})
    console.log('order successfull');
  res.render('success',{user: req.session.user,}) 
  
//   if (order.save) {
//     console.log("iam the king");
//     const productDetails = await Product.findOne({ _id:req.session.user_id });

//     await Product.updateOne({_id:req.session.user_id},{$set:{$inc: { stock: -1}}})
//     // console.log(order.products.item.qty);
//     console.log(productDetails);
//     console.log("iam the king1");  
    
//   } else {
//     console.log("really bad");
//   }

}
module.exports = {
    
    loadCheckout,
    applyCoupon,
    placeOrder,
    loadSuccess
}