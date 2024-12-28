const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        next();
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

const tokenSchema = new mongoose.Schema({
    refresh_token: {
        type: String,
        required: true,
    },
})

const User = mongoose.model("User", userSchema);
const Token = mongoose.model("Token", tokenSchema);

module.exports = {
    User,
    Token
};