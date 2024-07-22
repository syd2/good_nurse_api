class ApiResponse {
    successResponse(res: any, data: any, message: string) {
        const result = {
            success: true,
            data,
            err: null,
            message,
            version: "v1.0",
            status_code: 200,
        }
        return res.json(result)
    }

    errorResponse(res: any, err: any, message: string, code = 400) {
        const result = {
            success: false,
            data: null,
            err,
            message,
            version: "v1.0",
            status_code: code,
        }
        return res.status(code).json(result)
    }
}

export { ApiResponse }
