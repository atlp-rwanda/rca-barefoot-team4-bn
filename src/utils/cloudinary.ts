import {v2 as cloudinary} from 'cloudinary'
import config from 'config'

cloudinary.config({
    cloud_name: config.get<string>("cloud_name"),
    api_key: config.get<string>("api_key"),
    api_secret: config.get<string>("api_secret")
})


export default cloudinary