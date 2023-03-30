const Category = require("../../models/category");

const loadCategory = async (req, res) => {
    try {
      var search = "";
      if (req.query.search) {
        // console.log("re"+req.query);
        search = req.query.search;
        // console.log("search:"+search);
      }
      const userData = await Category.find({
        
        $or: [
          { name: { $regex: ".*" + search + ".*" } },
         
        ],
      });
      res.render("category", { users: userData, val: search });
    } catch (error) {
      console.log(error.message);
    }
};
 
  
//for loading categories in admin view file get
const loadAddCategories = async (req, res) => {
    try {
      const categoryData = await Category.find();
      res.render("addCategory", { category: categoryData });
    } catch (error) {
      console.log(error.message);
    }
  };

  //for adding categories in admin view file post

const addCategory = async (req, res) => {
    const categoryData = await Category.findOne({ name: req.body.category });
    const categoryAll = await Category.find();
    console.log(categoryData);
    if (categoryData) {
      res.render("addCategory", {
        category: categoryAll,
        val: "",
        message: "category already Exists",
      });
    } else {
      try {
        const category = Category({
          name: req.body.category,
        });
        console.log("//////////////");
        console.log(category);
        console.log("//////////////");
        const categoryData = await category.save();

        // await category.save();
        console.log("...........................");
        res.redirect("category");
      } catch (error) {
        console.log(error);
        console.log("some problems occured");
      }
    }
  };

  //block category
const blockCategory = async (req, res) => {
    try {
      const id = req.query.id;
      const userData = await Category.findOne({ _id: id });
      if (userData.isAvailable ==1) {
        const userData = await Category.findByIdAndUpdate(
          { _id: id },
          { $set: { isAvailable: 0 } }
        );
        console.log("blocked");
      } else {
        await Category.findByIdAndUpdate({ _id: id }, { $set: { isAvailable: 1 } });
      }
      console.log("unblocked");
      res.redirect("/admin/category");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async (req, res) => {
    try {
      const id = req.query.id;
      const catagoryData = await Category.updateOne(
        { _id: id },
        { $set: { isAvailable: 0 } }
      );
  
      res.redirect("category");
    } catch (error) {
      console.log(error.message);
    }
  };

  const editCategoryLoad = async (req, res) => {
    try {
      const id = req.query.id;
      const userData = await Category.findById({ _id: id });
      if (userData) {
        res.render("editCategory", { category: userData, });
      } else {
        res.redirect("category");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const editCategory = async (req, res) => {
    try {
      id=req.query.id;
      const nCat= req.body.category;
      const catagoryData = await Category.updateOne({_id:id},{$set:{name:nCat}});
      // if(catagoryData){await Category.save();}
      res.redirect("admin/category");
      
    } catch (error) {
      console.log(error.message);
    }
  }  
module.exports = {
    loadCategory,
    loadAddCategories,
    addCategory,
    blockCategory,
    deleteCategory,
    editCategoryLoad,
    editCategory
};
