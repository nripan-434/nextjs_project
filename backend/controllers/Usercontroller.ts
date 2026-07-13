import bcrypt from 'bcryptjs';
import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../server.js';     

export const Registercontroller = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide username, email, and password" });
        }

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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        // Industry Standard: Auto-login the user after registration so they don't have to log in manually
        req.login(newUser, (err) => {
            if (err) return next(err);
            return res.status(201).json({
                message: "User registered and logged in successfully",
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                }
            });
        });

    } catch (error) {
        console.error("Error in registration:", error);
        return res.status(500).json({ message: "Server error during registration" });
    }
};

// ==========================================
// Local Login Controller
// ==========================================
export const Logincontroller = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !user.password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Use passport's req.login to establish the session identically to Google OAuth
        req.login(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({
                message: "Logged in successfully",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar
                }
            });
        });

    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ message: "Server error during login" });
    }
};

// ==========================================
// Update Profile Controller (Progressive Profiling)
// ==========================================
export const UpdateProfileController = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const userId = (req.user as any).id;
        const { bio, role, githubUrl, techStack } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                bio,
                role,
                githubUrl,
                techStack: techStack || [],
                isProfileComplete: true // Mark as complete!
            }
        });

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Server error during profile update" });
    }
};

// ==========================================
// Google OAuth Callback Controller
// ==========================================
export const googleAuthCallback = (req: Request, res: Response) => {
    if (!req.user) {
        return res.redirect('http://localhost:3000/login?error=auth_failed');
    }
    return res.redirect('http://localhost:3000/userhome');
};
