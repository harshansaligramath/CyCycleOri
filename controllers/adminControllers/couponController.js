const Coupons = require("../../models/coupon");

const loadCoupon = async (req,res)=>{
  try {
    const couponData = await Coupons.find()
    res.render('coupon',{message: undefined, val:'' , coupon:couponData})
  } catch (error) {
    console.log(error.message);
  }
}

const addCoupon = async (req,res)=>{
  try {
    const coupon = new Coupons({
      name : req.body.name,
      discount: req.body.discount,
      max:req.body.maxDiscount,
      min:req.body.minValue
    })
    await coupon.save()
    res.redirect('coupon')
  } catch (error) {
    console.log(error.message);
  }
}


// editing page load banner method get

const editCouponLoad = async (req, res) => {
  try {
    const id = req.query.id;

    const userData = await Coupons.findById({ _id: id });
    if (userData) {
      res.render("editCoupon", { product: userData});
    } else {
      res.redirect("editCoupon");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const editCoupon = async (req, res) => {
  try {
    id=req.query.id;
    const name= req.body.name;
    const discount=req.body.discount;
    const max=req.body.maxDiscount;
    const min=req.body.minValue;
    const catagoryData = await Coupons.updateOne(
      
      {_id:id},
      {$set:{
        name:name,
        // discount:discount,
        max:max,
        min:min
      },}
      );
    // if(catagoryData){await Category.save();}
    res.redirect("coupon");
    
  } catch (error) {
    console.log(error.message);
  }
}  


const blockCoupon = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Coupons.findOne({ _id: id });

    if (userData.isAvailable ==1) {
      const userData = await Coupons.findByIdAndUpdate(
        { _id: id },
        { $set: { isAvailable:0 } }
      );
      console.log("blocked");
    } else {
      await Coupons.findByIdAndUpdate({ _id: id }, { $set: { isAvailable: 1} });
    }
    console.log("unblocked");
    res.redirect("coupon");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loadCoupon,
  addCoupon,
  editCouponLoad,
  editCoupon,
  blockCoupon
 
};
