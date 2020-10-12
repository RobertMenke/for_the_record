import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { ConsoleModule } from 'nestjs-console'
import { CommandLineService } from './command-line.service'
import { CommandLineUiController } from './command-line-ui.controller'
import { FrequencyRepository } from './frequency.repository'
import { FrequencyStore } from './frequency.store'
import { Provider } from './provider'
import { TimerService } from './timer.service'
import * as readline from 'readline'

@Module({
    imports: [ConsoleModule, CqrsModule],
    controllers: [],
    providers: [
        CommandLineUiController,
        TimerService,
        CommandLineService,
        FrequencyRepository,
        FrequencyStore,
        {
            provide: Provider.READLINE,
            useValue: readline.createInterface({
                input: process.stdin,
                output: process.stdout
            })
        }
    ]
})
export class AppModule {}
