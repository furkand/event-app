const bcrypt = require('bcryptjs');
const User = require("../../models/user");

module.exports = {
    createUser: async (userInfos) =>{
        try{
         const user =  await User.findOne({email: userInfos.userInput.email})
            if(user){
                throw new Error('this email is already taken')
            }
            const hashedPassword = await bcrypt.hash(userInfos.userInput.password,12)

            const userSchema = new User({
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
         
    }
}