const express = require('express');
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const jwt = require('../utils/jwt');

exports.signUp = async (req, res) => {
    const { email, password, username, name } = req.body;

    let user = await User.findOne({
        email: email,
    });

    if (user) {
        return res.status(409).json({
            success: false,
            message: 'User already exists with the same email',
        });
    }

    user = await User.create({
        username: username,
        email: email,
        name: name,
        password: await hashPassword(password),
    });

    res.status(200).json({
        success: true,
        message: 'User created successfully',
        data: user,
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        email: email,
    });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        });
    }

    const isMatched = await comparePassword(password, user.password);

    if (!isMatched) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        });
    }

    const userInfo = user.toObject();
    delete userInfo['password'];

    return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            user: userInfo,
            accessToken: jwt.generateAccessToken(user),
            refreshToken: jwt.generateRefreshToken(user),
        },
    });
};

exports.refreshToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Missing refresh token',
        });
    }

    try {
        const decoded = jwt.verifyRefreshToken(token);
        const newAccessToken = jwt.generateAccessToken(decoded);
        return res.status(200).json({
            success: true,
            message: 'Token refreshed successfully.',
            data: {
                id: decoded.id,
                accessToken: newAccessToken,
                refreshToken: token,
            },
        });
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired refresh token',
        });
    }
};
