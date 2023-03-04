const Product = require("../../models/product");
const User=require("../../models/userModel")

 
// const addToWishList = async (req, res) => {
//     try {
//       if (req.session.user) {
//         session = req.session.user;
//       } else session = false;
//       res.render("wishList", { user: session,});
//     } catch (error) {
//       console.log(error.message);
//     }
//   }; 


  const addToWishList = async(req,res)=>{
    const productId = req.query.id
    if(session){
        const userData =await User.findById({_id:req.session.user_id})
        const productData =await Product.findById({ _id:productId })
        userData.addToWishlist(productData)
        res.redirect('/wishList')
    }else{
        res.redirect('/wishList')
    }
}

const deleteFromWishlist = async(req,res)=>{
  const productId = req.query.id
  const userData =await User.findById({_id:req.session.user_id})
  userData.removefromWishlist(productId)
  res.redirect('/wishList')
}
 
const loadWishList = async (req, res) => {
  try {
      if(req.session.user_id){
          const userData =await User.findById({ _id:req.session.user_id })
          const wishData = await userData.populate('wishlist.item.productId')
      res.render('wishList', { user: session, products:wishData.wishlist })
      }else{
          res.render('login',)

      }
  } catch (error) {
      console.log(error);
  }
}


module.exports = {
    addToWishList,
    deleteFromWishlist,
    loadWishList
    
};
