import { constants } from "../constants.js";

const errorHandler = (err, req, res, next)=>{
    const statusCode = res.statusCode ? res.statusCode : 500;

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({title:"Validation failed", message: err.message, stackTrace: err.stack});
            break;
        case constants.UNAUTHORIOSED:
            res.json({title:"NOT FOUND", message: err.message, stackTrace: err.stack});
            break;
        case constants.FORBIDDEN:
                res.json({title:"NOT FOUND", message: err.message, stackTrace: err.stack});
             break;
        case constants.NOT_FOUND:
                res.json({title:"NOT FOUND", message: err.message, stackTrace: err.stack});
            break;      
        case constants.SERVER_ERROR:
            res.json({title:"Server error", message: err.message, stackTrace: err.stack});
            break;

        default:
            break;
    }
   
};
export default errorHandler;