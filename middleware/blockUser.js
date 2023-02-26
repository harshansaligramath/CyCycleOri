const User = require("../models/userModel");

module.exports = async (req,res,next)=>{
    if (req.session.user1) {
        const user_status = await User.findOne({ _id: req.session.user_id })
        if (user_status.is_verified) {
          next();
        } else {
          console.log(user_status.name +' is logging out...');
          req.session.user1 = null;
          req.session.user = null;
          time = new Date().getHours() + ":" + new Date().getMinutes()
          await User.findByIdAndUpdate({ _id: req.session.user_id }, { $set: { status: time } });
          res.render('login', { message: "You have been temporarily blocked by the Administrator , Please login after sometime",  })
        }
      } else {
        next()
      }
}

