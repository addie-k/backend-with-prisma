import vine from "@vinejs/vine";
import { CustomErrReporter } from "./customeErrReporter.js";
vine.errorReporter = () => new CustomErrReporter()
export const newsSchema= vine.object({
    title:vine.string().minLength(5).maxLength(200),
    content:vine.string().minLength(10).maxLength(30000)
})
