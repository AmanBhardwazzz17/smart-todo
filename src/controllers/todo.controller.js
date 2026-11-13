import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Todo} from "../models/todo.model.js"

// Naya todo: owner body se nahi, token se aata hai (req.user)

const createTodo = asyncHandler (async (req, res) => {
    const {content, priority } = req.body;
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");
    }


    // owner body se kabhi mat lo, warna koi bhi doosre ki id bhej ke uske naam todo bana dega
    const todo = await Todo.create({ content, priority,owner: req.user._id });
    return res.status(201).json(new ApiResponse(201,todo, " Todo created"));
});


// Sirf logged-in user ke todos

const getTodos = asyncHandler(async (req ,res) => {
    const todos = await Todo.find({ owner: req.user._id }).sort({ createdAt: -1});
    return res.status(200).json(new ApiResponse(200,todos, "Todos fetched"))
});


// Toggle: todo tabhi milega jab id bhi sahi ho AUR owner bhi wahi ho

const toggleTodo = asyncHandler(async(req ,res) => {
    const { id } = req.params;
    if(!mongoose.isValidObjectId(id)) {
        throw new ApiError(400,"Invalid todo id");
    }
    const todo = await Todo.findOne({ _id: id , owner: req.user._id});


    // Doosre ka todo ho ya na ho, dono case mein 404 (batate nahi ki wo exist karta hai)
    if (!todo) {
        throw new ApiError(404, " Todo not Found");
    }
    todo.isComplete = !todo.isComplete;
    await todo.save();
    return res.status(200).json(new ApiResponse(200,todo, "Todo Updated"));
});


// Delete: wahi owner check

const deleteTodo = asyncHandler(async(req,res) =>{
    const { id } = req.params;
    if(!mongoose.isValidObjectId(id)){
        throw new ApiError(400, "Invalid todo Id")
    }

    const todo = await Todo.findOneAndDelete({_id: id, owner: req.user._id });
    if (!todo) {
        throw new ApiError(404, " Todo Not Found");
    }

    return res.status (200).json(new ApiResponse(200,{}, "Todo Delete"))
});


export { createTodo, getTodos, toggleTodo, deleteTodo };
