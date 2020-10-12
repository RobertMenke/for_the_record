import { NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import { AppModule } from './app.module'
import { CommandLineService } from './command-line.service'
import { CommandLineServiceFake } from './command-line.service.fake'
import { FrequencyStore } from './frequency.store'

export async function setup(): Promise<NestExpressApplication> {
    const appBuilder = Test.createTestingModule({
        imports: [AppModule]
    })
        .overrideProvider(CommandLineService)
        .useClass(CommandLineServiceFake)

    const testingModule = await appBuilder.compile()
    const app = testingModule.createNestApplication<NestExpressApplication>()
    await app.init()

    return app
}

export function resetTestingState(app: NestExpressApplication) {
    CommandLineServiceFake.nextInput = `10`
    CommandLineServiceFake.gatherNextNumberDelay = 0
    // This method of resetting the store isn't ideal, but under normal circumstances the app would be dropping a DB here
    const store = app.get<FrequencyStore>(FrequencyStore)
    store.frequencyMap = new Map()
    store.timeBetweenOutput = -1
    store.timerInProgress = false
}
