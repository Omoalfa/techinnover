import { CLOUD_API_KEY, CLOUD_API_SECRET, CLOUD_NAME, NODE_ENV } from "@/Config";
import { v2 as cloudinary} from "cloudinary";


cloudinary.config({ 
  cloud_name: CLOUD_NAME, 
  api_key: CLOUD_API_KEY, //'249335845911927', 
  api_secret: CLOUD_API_SECRET, // '***************************' 
  secure: true,
});

const uploadFunction = async (filePath: string): Promise<string> => {
  if (NODE_ENV === "test") return "https://res.cloudinary.com/omoalfa/image/upload/v1689167555/mqdul3zwiw0xkpeuhfov.jpg"

  const res = await cloudinary.uploader.upload(filePath);

  return res.secure_url;
}

export default uploadFunction;
