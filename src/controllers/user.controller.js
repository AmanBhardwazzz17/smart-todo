import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {User} from '../models/user.model.js';


const registerUser = asyncHandler(async (req,res) => {
    const {username,email,password} = req.body;

    if ([username, email, password].some((f) => !f || f.trim() === "")) {
        throw new ApiError(400,'All fields are required');
    }
    const existingUser = await User.findOne({
        $or: [{email}, {username: username.toLowerCase() }],
    });
    if (existingUser) {
        throw new ApiError(409,'User already exists');
    }
    const user = await User.create({username,email,password});
    const createdUser = await User.findById(user._id).select("-password");
    return res
    .status(201)
    .json(new ApiResponse(201,createdUser,'User registered successfully'));


});

export {registerUser};
