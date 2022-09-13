import joi from "joi";
// import joi.objectId from "joi-objectid"(joi);

const noteValidations = {
    noteValidator: {
        body: joi.object({
           title: joi.string().required().min(7).alphanum(),
           description: joi.string().required().min(25).alphanum(),
           writtenBy: joi.objectId().required(),
           status: joi.string().valid('completed','pending').default('pending'),
           categoryId: joi.objectId().required(),
           tags: joi.array().items(joi.string()).optional().default('null')
        })
    }
}

export default noteValidations;