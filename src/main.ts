import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import 'dotenv/config'
import { AppModule } from './app/app.module'
import { RequestIdExceptionFilter } from './common/filters/request-id-exception.filter'
import { RequestIdInterceptor } from './common/interceptors/request-id.interceptor'

async function bootstrap() {
    const port = Number(process.env.PORT)
    const app = await NestFactory.create(AppModule)
    app.useGlobalFilters(new RequestIdExceptionFilter())
    app.useGlobalInterceptors(new RequestIdInterceptor())

    // Swagger config
    const config = new DocumentBuilder()
        .setTitle('Image Generator API')
        .setDescription('API for image generation and management')
        .setVersion('1.0')
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('swagger', app, document)

    await app.listen(port)
    console.log(`Service has been started on port ${port}`)
    console.log(`Swagger docs here http://localhost:${port}/swagger`)
}
bootstrap()
