import jwt from "jsonwebtoken";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";

export const verifyjwt =  asyncHandler(async (req,res,next) => {
// 1. Token nikalo. Browser mein cookie se aata hai, Postman mein header se bhi chalega.
    const token =
       req.cookies?.accessToken ||
       req.header("Authorization")?.replace("Bearer ", "");

// 2. Token hi nahi mila matlab user login nahi hai -> 401
    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

// 3. Token asli hai ya nahi, aur expire to nahi hua, ye jwt.verify check karta hai.
//    Galat token par wo error phenkta hai, use hum 401 mein badalte hain (500 nahi).
    let decodedToken;
    try {
        decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid or expired token");
    }
// 4. Token ke andar jo _id thi, usse user dhoondho. Password bahar mat nikalo.
    const user = await User.findById(decodedToken._id).select("-password");
    if (!user) {
        throw new ApiError(401, "Invalid access token");
    }
// 5. User ko req mein rakh do, ab aage ke controllers seedha req.user use karenge
    req.user = user;
// 6. next() bulao, warna request yahin atak jaati hai
    next();
});
