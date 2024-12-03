import jwt from "jsonwebtoken";
const authMiddleware = (req,res,next)=>{
    const authHeaders = req.headers.authorization
    if(!authHeaders){
        return res.status(401).json({
            status:401,
            message:"Unauthorized"
        })
    }
    const token =  authHeaders.split(" ")[1];
    jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(403).json({
                status:403,
                message:"Unauthorized acess or Invalid token"
                })
        }
        req.user = payload
        next()
    })
}
export default authMiddleware