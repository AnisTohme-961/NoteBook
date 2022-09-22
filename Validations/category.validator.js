import Joi from "joi";
import JoiObjectId from "joi-objectid";

const myJoiObjectId = JoiObjectId(Joi);

const categorySchema = Joi.object({
    title: Joi.string().required().min(5),
    description: Joi.string().min(3).max(100).required(),
})

export default categorySchema;