import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { CommandLineUiController } from './command-line-ui.controller'
import { Prompt } from './prompt'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: false
    })

    const ui = app.get<CommandLineUiController>(CommandLineUiController)
    await ui.start()
    await ui.handleInput(Prompt.FIRST_NUMBER)
    await app.close()
    process.exit(0)
}

bootstrap()
