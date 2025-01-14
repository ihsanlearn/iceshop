import mongoose from "mongoose"

const mongoURI = process.env.MONGODB_URI

export default async function connectDB() {
   if (mongoose.connections[0].readyState) {
      console.log("already connected to mongodb")
      return
   }

   try {
      if (!mongoURI) {
         throw new Error("mongodb uri undefined")
      }
      
      const conn = await mongoose.connect(mongoURI)
      console.log(`connected to mongo. details: ${conn.connect.name}`)
   } catch (err) {
      console.error(err)
      throw new Error("failed to connect to mongodb")
   }
}