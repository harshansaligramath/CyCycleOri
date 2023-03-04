


const Coupons = require("../../models/coupon");


  
const loadUsersProfile = async (req, res) => {
  try {
      if(req.session.user_id){
    const couponData = await Coupons.find()

      res.render('usersProfileHome', { user: session, message: undefined, val:'' , coupon:couponData })
      }else{
          res.render('login',)

      }
  } catch (error) {
      console.log(error);
  }
}


module.exports = {
    loadUsersProfile    
};
