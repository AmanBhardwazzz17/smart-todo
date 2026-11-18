import { z } from "zod";

// Register ke liye rules (blueprint)
export const registerSchema = z.object({
    // string ho, aur kam se kam 3 akshar
    username: z
        .string({required_error: "Username is required"})
        .trim()
        .min(3,"Username must be at least 3 characters"),
    
    // string ho, aur email jaisa dikhe (@ aur domain)
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email("Invalid email format"),
        
    // string ho, aur kam se kam 8 akshar
    password: z
        .string({ required_error: "Password is required"})
        .min(8, "Password must be at least 8 characters")

});


