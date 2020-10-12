import { NestExpressApplication } from '@nestjs/platform-express'
import { CommandLineServiceFake } from './command-line.service.fake'
import { CommandLineUiController } from './command-line-ui.controller'
import { FrequencyRepository } from './frequency.repository'
import { InputKeyword } from './input-keyword'
import { resetTestingState, setup } from './main.test'
import { Prompt } from './prompt'
import { TimerService } from './timer.service'

describe(CommandLineUiController.name, () => {
    let app: NestExpressApplication
    let ui: CommandLineUiController
    let timerService: TimerService
    let frequencyRepository: FrequencyRepository

    beforeAll(async () => {
        app = await setup()
        ui = app.get<CommandLineUiController>(CommandLineUiController)
        timerService = app.get<TimerService>(TimerService)
        frequencyRepository = app.get<FrequencyRepository>(FrequencyRepository)
    })

    afterEach(() => {
        resetTestingState(app)
    })

    afterAll(async () => {
        await app.close()
    })

    it('Should set the update frequency successfully', async () => {
        CommandLineServiceFake.nextInput = `15`
        await ui.start()
        await ui.quit()
        const frequency = frequencyRepository.getTimeBetweenOutput()
        expect(frequency).toBe(parseInt(CommandLineServiceFake.nextInput, 10))
    })

    it('Should respond to the quit event successfully', async () => {
        CommandLineServiceFake.nextInput = `5`
        await ui.start()
        expect(frequencyRepository.getTimerIsInProgress()).toBeTruthy()
        CommandLineServiceFake.nextInput = InputKeyword.QUIT
        await ui.handleInput(Prompt.FIRST_NUMBER)
        expect(frequencyRepository.getTimerIsInProgress()).toBeFalsy()
    })

    it('Should respond to the halt event successfully', async () => {
        const spy = jest.spyOn(timerService, 'halt')
        jest.spyOn(ui, 'shouldContinueAfterKeyword').mockImplementation(() => false)
        CommandLineServiceFake.nextInput = `5`
        await ui.start()
        CommandLineServiceFake.nextInput = InputKeyword.HALT
        await ui.handleInput(Prompt.FIRST_NUMBER)
        CommandLineServiceFake.nextInput = InputKeyword.QUIT
        expect(spy.mock.calls.length).toBe(1)
    })

    it('Should respond to the resume event successfully', async () => {
        const spy = jest.spyOn(timerService, 'resume')
        jest.spyOn(ui, 'shouldContinueAfterKeyword').mockImplementation(() => false)
        CommandLineServiceFake.nextInput = `5`
        await ui.start()
        CommandLineServiceFake.nextInput = InputKeyword.RESUME
        await ui.handleInput(Prompt.FIRST_NUMBER)
        CommandLineServiceFake.nextInput = InputKeyword.QUIT
        expect(spy.mock.calls.length).toBe(1)
    })
})
