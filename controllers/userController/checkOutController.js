const User=require("../../models/userModel")

const loadcheckOut = async (req, res) => {
    try {
        if(req.session.user_id){
            const userData =await User.findById({ _id:req.session.user_id })
            const cartData = await userData.populate('cart.item.productId')
        res.render('checkoutPage', { user: session,products:cartData.cart })}
        else{
            res.render('login', { user: session,products:null })
        }
    } catch (error) {
        console.log(error);
    }  
};

module.exports = {
  loadcheckOut,
};
