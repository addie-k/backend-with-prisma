import { imageValidator } from "../utils/helper.js";
import { newsSchema } from "../validations/newsValidation.js";
import vine, { errors } from "@vinejs/vine";
import { generateRandomNum } from "../utils/helper.js";
import prisma from "../DB/db.config.js";
class NewsController {
  static async index(req, res) {}
  static async show(req, res) {}
  static async store(req, res) {
    try {
      const user = req.user;
      const body = req.body;
      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(body);
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          errors: {
            image: "Image field is required.",
          },
        });
      }
      const image = req.files?.image;
      //image custom validator
      const message = imageValidator(image?.size, image?.mimetype);
      if (message !== null) {
        return res.status(400).json({
          errors: {
            image: message,
          },
        });
      }

      const imgExt = image.name.split(".");
      const imageName = generateRandomNum() + "." + imgExt[1];
      const uploadPath = process.cwd() + "/public/images/" + imageName;

      image.mv(uploadPath, (err) => {
        if (err) throw err;
      });

      payload.image = imageName
      payload.userId = user.userId
      console.log('api endpoint hit before prisma')

      const news = await prisma.news.create({
        data:{
            title:payload.title,
            content:payload.content,
            image:payload.image,
            user:{
                connect:{id:payload.userId}
            }
        }
      })

      return res.json({message:news} );
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        // array created by SimpleErrorReporter
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong on the server side.",
        });
      }
    }
  }
  static async update(req, res) {}
  static async destroy(req, res) {}
}
export default NewsController;
