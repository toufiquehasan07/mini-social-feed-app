const express = require('express');

exports.getAll = async (req,) => {
    res.status(200).json({ message: "Get all post" });
}

exports.create = async (req,) => {
    res.status(200).json({ message: "Create new post" });
}

