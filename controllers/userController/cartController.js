
const User = require('../../models/userModel')
const Product = require('../../models/product')

const loadCart = async (req, res) => { 
    try {
        if(req.session.user_id){
            const userData =await User.findById({ _id:req.session.user_id })
            const cartData = await userData.populate('cart.item.productId')
        res.render('cart', { user: session, products:cartData.cart })}
        else{
          res.render('login',)

            // res.render('cart', { user: session,products:null })
        }
    } catch (error) {
        console.log(error);
    }
}  
const updateCart = async(req,res)=>{
    try{
        let { quantity , _id } = req.body
            const userData =await User.findById({_id:req.session.user_id})
            const total =await userData.updateCart(_id , quantity)
            // console.log("hiiiiii");
            // console.log(total);
          res.json({total})
    }catch(error){
        console.log(error)
    }
}
const addToCart = async(req,res)=>{
    try{
        const productId = req.query.id
        console.log('proid'+productId);
        userSession = req.session.user_id
        console.log(userSession);
        if(userSession){
            const userData =await User.findById({_id:req.session.user_id})
            const productData =await Product.findById({ _id:productId })
            userData.addToCart(productData)
            res.redirect('/cart')
        }else{
            res.redirect('/login')
        }
    }catch(error){
        console.log(error)
    }
}
const removeFromCart = async(req,res)=>{
    const productId = req.query.id
    const userData =await User.findById({_id:req.session.user_id})
    userData.removefromCart(productId)
    res.redirect('/cart')
}
module.exports = {
    
    updateCart,
    addToCart,
    removeFromCart,
    loadCart
};
