import joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(joi);

const noteValidations = {
    noteValidator: {
        body: joi.object({
           title: joi.string().required().min(7).alphanum(),
           description: joi.string().required().min(25).alphanum(),
           writtenBy: myJoiObjectId().required(),
           status: joi.string().valid('completed','pending').default('pending'),
           categoryId: myJoiObjectId().required(),
           tags: joi.array().items(joi.string()).optional().default('null')
        })
    }
}

export default noteValidations;