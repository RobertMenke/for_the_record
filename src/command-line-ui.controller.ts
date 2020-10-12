import { Injectable } from '@nestjs/common'
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception'
import { CommandLineService } from './command-line.service'
import { InputKeyword } from './input-keyword'
import { Prompt } from './prompt'
import { TimerService } from './timer.service'

@Injectable()
export class CommandLineUiController {
    private appIsRunning = false

    constructor(private readonly commandLineService: CommandLineService, private readonly timerService: TimerService) {}

    async start() {
        this.appIsRunning = true
        const input = await this.commandLineService.gatherOutputFrequency()
        this.timerService.setTimeIntervalForFrequencyOutput(input)
    }

    async handleInput(prompt: Prompt = Prompt.NEXT_NUMBER) {
        if (!this.appIsRunning) {
            return
        }

        const nextInput = await this.commandLineService.gatherInput(prompt)

        if (this.getKeywords().indexOf(nextInput) >= 0) {
            await this.handleKeyword(nextInput)
            if (this.shouldContinueAfterKeyword(nextInput)) {
                await this.handleInput(Prompt.EMPTY)
            }

            return
        }

        try {
            const number = BigInt(nextInput)
            if (this.timerService.numberIsInFibonacciSequence(number)) {
                console.log('FIB')
            }

            this.timerService.addInput(number)
            await this.handleInput()
        } catch (e) {
            await this.handleInput()
        }
    }

    getKeywords(): string[] {
        return [InputKeyword.HALT, InputKeyword.RESUME, InputKeyword.QUIT]
    }

    async handleKeyword(keyword: string): Promise<void> {
        switch (keyword) {
            case InputKeyword.HALT:
                this.timerService.halt()
                this.commandLineService.halt()
                break
            case InputKeyword.RESUME:
                this.commandLineService.resume()
                this.timerService.resume()
                break
            case InputKeyword.QUIT:
                await this.quit()
                break
            default:
                throw new RuntimeException(`Failed to handle command`)
        }
    }

    async quit() {
        this.timerService.quit()
        await this.commandLineService.quit()
        this.appIsRunning = false
    }

    shouldContinueAfterKeyword(keyword: string): boolean {
        return keyword !== InputKeyword.QUIT
    }
}
