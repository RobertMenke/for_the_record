import { NestExpressApplication } from '@nestjs/platform-express'
import { CommandLineUiController } from './command-line-ui.controller'
import { FrequencyRepository } from './frequency.repository'
import { resetTestingState, setup } from './main.test'
import { TimerService } from './timer.service'

describe(TimerService.name, () => {
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

    it('Should add inputs to the data store', () => {
        timerService.addInput(5n)
        timerService.addInput(6n)
        timerService.addInput(6n)
        const frequencies = frequencyRepository.getFrequencies()
        expect(frequencies.get(6n)).toBe(2)
        expect(frequencies.get(5n)).toBe(1)
    })

    it('Should start a timer when supplied with a valid interval', () => {
        expect(frequencyRepository.getTimerIsInProgress()).toBeFalsy()
        timerService.setTimeIntervalForFrequencyOutput(3)
        const interval = frequencyRepository.getTimeBetweenOutput()
        expect(interval).toBe(3)
        expect(frequencyRepository.getTimerIsInProgress()).toBeTruthy()
    })

    it('Should not start a timer when supplied with an invalid interval', () => {
        timerService.setTimeIntervalForFrequencyOutput(-1)
        expect(frequencyRepository.getTimerIsInProgress()).toBeFalsy()
    })

    it('Should detect fibonacci numbers', () => {
        const expected = {
            0: true,
            1: true,
            2: true,
            3: true,
            4: false,
            5: true,
            6: false,
            7: false,
            8: true,
            9: false,
            10: false
        }

        Object.keys(expected).forEach((key) => {
            expect(timerService.numberIsInFibonacciSequence(BigInt(key))).toBe(expected[key])
        })
    })

    it('Should recognize up to 1000 fibonacci numbers in the fibonacci sequence', () => {
        const fibonacci1000 = 43466557686937456435688527675040625802564660517371780402481729089536555417949051890403879840079255169295922593080322634775209689623239873322471161642996440906533187938298969649928516003704476137795166849228875n
        const fibonacci1001 = 70330367711422815821835254877183549770181269836358732742604905087154537118196933579742249494562611733487750449241765991088186363265450223647106012053374121273867339111198139373125598767690091902245245323403501n

        expect(timerService.numberIsInFibonacciSequence(fibonacci1000)).toBeTruthy()
        expect(timerService.numberIsInFibonacciSequence(fibonacci1001)).toBeFalsy()
    }, 60000)
})
