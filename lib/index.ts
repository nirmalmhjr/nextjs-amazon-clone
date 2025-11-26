import mongoose, { mongo } from "mongoose";
import { cache } from "react";

const cached = (global as any).mongoose || {conn: null , promise: null}

export const connectToDatabase = async(MONGODB_URI = process.env.MONGODB_URI)=>{
    if(cached.conn) return cached.conn

    if(!MONGODB_URI) throw new Error('MONGODB_URI is missing')

    cached.promise = cached.promise || mongoose.connect(MONGODB_URI)

    cached.conn = await cached.promise

    return cached.conn

}