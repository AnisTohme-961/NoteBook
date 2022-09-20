<<<<<<< HEAD
import Validators from "../Validations/index.js";
=======
import Validators from "../Validations";
>>>>>>> bc11d7d15879641e1e2c5755de53c1407cf8b789

const Validator = (validator) => {
  return (req, res, next) => {
    try {
      const { error } = Validators[validator].validate(req.body);
      if (error) {
        return res.status(400).json({
          status: 400,
          error: error.details[0].message,
        });
      }
      next();
    } catch (error) {
        next(error)
    }
  };
};

export default Validator;