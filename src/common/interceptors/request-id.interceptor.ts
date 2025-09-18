import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp()
        const request = ctx.getRequest()
        const response = ctx.getResponse()
        const xRequestId = request.headers['x-request-id'] || null

        return next.handle().pipe(
            map((data) => {
                // Добавляем x-request-id в тело ответа
                if (data && typeof data === 'object' && xRequestId) {
                    data.requestId = xRequestId
                }
                // Добавляем x-request-id в заголовок
                if (xRequestId) {
                    response.set('x-request-id', xRequestId)
                }
                return data
            })
        )
    }
}
