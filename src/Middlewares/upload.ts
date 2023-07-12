import { logger } from "@/Logger";
import { serverError } from "@/Utils/api_response";
import uploadFunction from "@/Utils/cloudinary";
import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";

@Service()
class FileUploader {

  public upload = async (req: Request, res: Response, next: NextFunction) => {
    const imageFile = (req as any).files.image.tempFilePath;

    try {
      const image = await uploadFunction(imageFile);

      req.body.image = image;

      return next()
    } catch (error) {
      logger.error(error);
      return serverError(res);
    }
  }
}

export default FileUploader;
