import { NestFactory } from '@nestjs/core'
import 'dotenv/config'
import { AppModule } from './app.module'

async function bootstrap() {
    const port = Number(process.env.PORT)
    const app = await NestFactory.create(AppModule)
    await app.listen(port)
    console.log(`Service has been started on port ${port}`)
}
bootstrap()
