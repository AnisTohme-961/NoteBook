import joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(joi);

const categoryValidations = {
    categoryValidator: {
        body: joi.object({
            title: joi.string().required().min(5),
            writtenBy: myJoiObjectId().required()
        })
    }
}

export default categoryValidations;