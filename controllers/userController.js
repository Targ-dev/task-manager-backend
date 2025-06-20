import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

export const registerUser = async (req , res) => {
    try {
        const {name, email, password} = req.body;

        const userExists = await User.findOne({email})
        if(userExists) {
            res.status(400).json({message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        const token = generateToken(user._id)

        res.status(201).json({
            _id : user._id,
            name: user.name,
            email: user.email,
            token
        })
    } catch(error) {
        res.status(500).json({message: error.message})
    }
}

export const loginUser = async (req , res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({ email })
        if(!user) {
            res.status(401).json({message: "Invalid email or password"})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            res.status(401).json({message: "Invalid email or password"})
        }

        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token
        })
    } catch(error) {
        res.status(500).json({message: error.message})
    }
}