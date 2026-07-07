import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { prisma } from '../server.js';     

export const Registercontroller = async (req: Request, res: Response): Promise<any> => {
    try {
        // Notice I changed 'name' to 'username' to match your schema.prisma!
        const { username, email, password } = req.body;

        // 1. Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide username, email, and password" });
        }

        // 2. Check if a user with that email or username already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: "User with this email or username already exists" });
        }

        // 3. Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Save the new user to the database using Prisma
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        // 5. Send a success response (omitting the password!)
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            }
        });

    } catch (error) {
        console.error("Error in registration:", error);
        return res.status(500).json({ message: "Server error during registration" });
    }
};
