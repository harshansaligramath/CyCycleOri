const User = require('../models/userModel')
const bcrypt = require('bcrypt');

const loadRegister = async (req, res) => {
    try {
        res.render('login',{active:1})
    }
    catch (error) {
        console.log(error.message)
    }
}


const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    }
    catch (error) {
        console.log(error.message)
    }
}
const insertUser = async (req, res) => {
    try {

        const spassword = await securePassword(req.body.password);
        // console.log("sp"+spassword)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            password: spassword,
            is_admin: 0

        });
        const userData = await user.save();
        console.log(userData);

        if (userData) {
            res.redirect('/')
            // res.render('registration', { message: "your registration is succesful" })
        }
        else {
            res.render('registration', {message:"your registration is failed"})
        }

    }
    catch (error) {
        console.log(error.message);
    }
}

// login user 

const loginLoad = async (req, res) => {
    try {
        res.render('login',{active:0});
    }
    catch (error) {
        console.log(error.message);
    }
};

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email,is_admin:0 });
        console.log("user:"+userData)
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)
            // console.log("user p:"+password)
            // console.log("diclear p:"+userData.password)
            // console.log("user:"+passwordMatch)
            if (passwordMatch) {
                if(userData.is_verified){
                req.session.user_id = userData._id;
                req.session.user=userData.name;
                req.session.user1 = true
                const status = await User.findByIdAndUpdate({_id:userData._id},{$set:{status:1}}); console.log(status);
                res.redirect('/')
                } else{
                    res.render('login', {message:"You have been temporarily blocked by the Administrator , Please login after sometime",active:0}) 
                }
            }

            else {
                res.render('login', { message: 'email or password is incorrect' ,active:0})
            }
        }
        else {
            res.render('login', { message: 'invalid user credentials',active:0 })
        }



    }
    catch (error) {
        console.log(error.message);
    }
}

const loadHome = async (req, res) => {
    try {
        if(req.session.user){session=req.session.user}else session=false
        res.render('home',{user : session})
    }
    catch (error) {
        console.log(error.message)
    }
}

const userLogout = async (req, res) => {
    try {
        req.session.user1 = null;
        req.session.user = null;
        time = new Date().getHours()+":"+new Date().getMinutes()
        const status = await User.findByIdAndUpdate({_id:req.session.user_id},{$set:{status:time}}); console.log(status);

        res.redirect('/')
    }
    catch (error) {
        console.log(error.message)
    }

}


const loadProducts = async (req, res) => {
    try {
        res.render('products',{user:null})
    }
    catch (error) {
        console.log(error.message)
    }
}




module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    loadProducts
}
