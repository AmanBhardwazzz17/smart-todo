import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {User} from '../models/user.model.js';


const registerUser = asyncHandler(async (req,res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res



    // get user details from frontend
    const {username,email,password} = req.body;

    // validation - not empty
    if ([username, email, password].some((f) => !f || f.trim() === "")) {
        throw new ApiError(400,'All fields are required');
    }

    // check if user already exists: username, email
    const existingUser = await User.findOne({
        $or: [{email}, {username: username.toLowerCase() }],
    });
    if (existingUser) {
        throw new ApiError(409,'User already exists');
    }


    // create user object - create entry in db
    const user = await User.create({username,email,password});

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");


    // check for user creation
    if (!createdUser) {
        throw new ApiError(500,'User creation failed');
    }

    // return res
    return res
    .status(201)
    .json(new ApiResponse(201,createdUser,'User registered successfully'));

});


const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send cookie

    // req body -> data
    const { email, username, password } = req.body;

    // username or email
    if (!email && !username && !password) {
        throw new ApiError(400, 'Email or username and password are required');
    }

    // find the user
    const user = await User.findOne ({email});
    if (!user) {
        throw new ApiError(401, "Invalid Username or email or password");
    }

    // password check
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Username or email or password");
    }
    
    // access and refresh token
    const {accessToken, refreshToken} = await user.generateAccessToken();
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // send cookie
    const options = {
        httpOnly: true,
        secure: false, // set to true in production
        sameSite: 'strict', 
    };
    return res
        .status(200)
        .cookie('refreshToken', refreshToken, options)
        .json(new ApiResponse(200, {user: loggedInUser, accessToken}, 'User logged in successfully'));
});

// Logged-in user ki details wapas bhejta hai. req.user verifyJWT ne set kiya tha.
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, 'Current user fetched successfully'));
});

export {registerUser, loginUser, getCurrentUser};
