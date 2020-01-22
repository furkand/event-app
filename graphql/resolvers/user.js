const bcrypt = require('bcryptjs');
const User = require("../../models/user");
const jwt = require('jsonwebtoken')

module.exports = {
    createUser: async (userInfos) =>{
        try{
         const user =  await User.findOne({email: userInfos.userInput.email})
            if(user){
                throw new Error('this email is already taken')
            }
            const hashedPassword = await bcrypt.hash(userInfos.userInput.password,12)
            const token = await jwt.sign({userId: user.id, email: user.email}, "supersecretkeyisavailableingithubpublicly", 
            {expiresIn: '1h'})
            const userSchema = new User({
                token: token,
                email: userInfos.userInput.email,
                password : hashedPassword
            })
            const result = await userSchema.save();
            return { 
                ...result._doc ,password: null, _id: result.id
            }
        }
        catch (err){
            throw new Error(err);
        }
         
    },
    login: async({email,password}) =>{
        try{
            const user = await User.findOne({email:email});
            if(!user){
                throw new Error('User does not exist')
            }
           const isEqual = await bcrypt.compare(password,user.password)
           if(!isEqual){
               throw new Error("Password is incorrect")
           }
           const token = await jwt.sign({userId: user.id, email: user.email}, "supersecretkeyisavailableingithubpublicly", 
            {expiresIn: '1h'})
            return {
                userId: user.id,
                token: token,
                tokenExpiration:1
            }
        }
        catch(err){
            throw err
        }
    }
}