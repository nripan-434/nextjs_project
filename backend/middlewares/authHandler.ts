import type { Request, Response, NextFunction } from 'express';
export const AuthHandler = (req:Request,res:Response,next:NextFunction)=>{
    if(req.isAuthenticated()){
        next();
    }
    else{
        return res.status(401).json({message:"Not authenticated"})
    }

}