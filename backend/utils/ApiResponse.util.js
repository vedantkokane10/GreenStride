class ApiResponse{
    constructor(result, message, statusCode, success){
        this.result = result;
        this.message = message;
        this.statusCode = statusCode;
        this.success = success;
    }
};

export {ApiResponse};
