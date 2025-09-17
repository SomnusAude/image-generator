import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class RequestIdExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()
        const status = exception instanceof HttpException ? exception.getStatus() : 500
        const xRequestId = request.headers['x-request-id'] || null

        let message = exception.message || 'Internal server error'
        if (exception.response && exception.response.message) {
            message = exception.response.message
        }

        response.status(status).json({
            statusCode: status,
            message,
            requestId: xRequestId,
            timestamp: new Date().toISOString(),
            path: request.url,
        })
    }
}
