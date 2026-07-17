const express = require('express');
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateRefreshToken, generateAccessToken } = require("../utils/jwt");

exports.signUp = async (req, res) => {
    const { email, password, username } = req.body;

    let user = await User.findOne({
        email: email
    });

    if (user) {
        return res.status(409).json({
            success: false,
            message: "User already exists with the same email",
        });
    }

    user = await User.create({
        username: username,
        email: email,
        password: await hashPassword(password)
    });

    res.status(200).json({ success: true, message: "User created successfully", data: user });
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        email: email
    });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }

    const isMatched = await comparePassword(password, user.password);

    if (!isMatched) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }

    const userInfo = user.toObject();
    delete userInfo["password"];

    return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            user: userInfo,
            accessToken: generateAccessToken(user),
            refreshToken: generateRefreshToken(user)
        }
    });

}


