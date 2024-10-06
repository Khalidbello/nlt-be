import { Request, Response } from "express";
import { queryCourseImages } from "../../services/users/landning";

const getLandingCourseImages = async (req: Request, res: Response) => {
  try {
    const images = await queryCourseImages();

    images.forEach((element: any) => {
      element.image = Buffer.from(element.image).toString("base64");
    });

    res.json(images);
  } catch (err) {
    console.error("Error fetching course Images", err);
  }
};

export { getLandingCourseImages };
