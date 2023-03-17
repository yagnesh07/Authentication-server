const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
require("dotenv").config();

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, " An Account has already been linked to the Email"],
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Entered email is not a valid")
            }
        },
        max: 50
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

userSchema.methods.generateAuthToken = async function() {
    try {
        // create a secret key with token
        const token = await jwt.sign(
            { _id: this._id },
            "HelloThereThisIsTheSecretKey"
        );

        // add it to the list of tokens
        this.tokens = this.tokens.concat({ token: token })

        // return the token
        return token;
    } catch (error){
        console.log("error in token generation", error);
    }
}

module.exports = mongoose.model("Users", userSchema)