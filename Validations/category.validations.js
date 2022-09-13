import joi from "joi";
// import joi.objectId from "joi-objectid"(joi);

const categoryValidations = {
    categoryValidator: {
        body: joi.object({
            title: joi.string().required().min(5),
            writtenBy: joi.objectId().required()
        })
    }
}

export default categoryValidations;