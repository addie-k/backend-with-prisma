import { supportedMimes } from "../config/filesystem.js"
import {v4 as uuid} from "uuid"
export const imageValidator = (size,mime) => {
    if(bytesToMB(size) > 2){
        return "Image size must be less than 2 MB"
    }
    else if(!supportedMimes.includes(mime)){
        return "Image must be a supported MIME-Type"
    }
    return null;
}

export const bytesToMB = (bytes)=>{
    return bytes / (1024 * 1024)
}

export const generateRandomNum = () => {
    return uuid()
}