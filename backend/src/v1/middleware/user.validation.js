import Joi from 'joi';

const registerUserValidation = (req, res, next) => {
    console.log(req.user);
    
    const { name, email, password, address, phone } = req.body;
    // console.log(name, email, password, address, phone);
    
    const schema = Joi.object({
        name: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.optional()
        }).optional(),
        email: Joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] }
        }).optional(),
        password: Joi.string().min(8).optional(),
        address: Joi.object({
            houseNo: Joi.string().required(),
            street: Joi.string().required(),
            locality: Joi.string().required(),
            city: Joi.string().required(),
            pinCode: Joi.string().required()
        }).optional(),
        phone: Joi.string().optional()
    });

    const { error } = schema.validate({ name, email, password, address, phone });

    if (error) {
        console.log(error.message);
        
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message
        });
    }

    next();
};

const profileValidation = (req, res, next) => {
    const { name, email, phone, role } = req.body;
    
    const schema = Joi.object({
        name: Joi.object({
            firstName: Joi.string().trim().required(),
            lastName: Joi.string().trim().optional()
        }).optional(),
        email: Joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] }
        }).optional(),
        phone: Joi.string().optional(),
        role: Joi.string().valid('user', 'admin').optional()
    });

    const { error } = schema.validate({ name, email, phone, role });

    if (error) {
        console.log(error.message);
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
};

const addressValidation = (req, res, next) => {
    const { address } = req.body;
    
    const schema = Joi.object({
        address: Joi.object({
            houseNo: Joi.string().trim().required(),
            street: Joi.string().trim().required(),
            locality: Joi.string().trim().required(),
            city: Joi.string().trim().required(),
            state: Joi.string().trim().optional(),
            pinCode: Joi.string().trim().required()
        }).required()
    });

    const { error } = schema.validate({ address });

    if (error) {
        console.log(error.message);
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
};

const passwordValidation = (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    
    const schema = Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().min(8).required()
    });

    const { error } = schema.validate({ currentPassword, newPassword });

    if (error) {
        console.log(error.message);
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
};

// Export with default as registerUserValidation for backward compatibility
export { 
    profileValidation, 
    addressValidation, 
    passwordValidation, 
    registerUserValidation 
};