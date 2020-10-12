import { Inject, Injectable } from '@nestjs/common'
import { ReadLine } from 'readline'
import { GathersInput } from './gathers-input.interface'
import { Prompt } from './prompt'
import { Provider } from './provider'

@Injectable()
export class CommandLineService implements GathersInput {
    constructor(@Inject(Provider.READLINE) private readonly readline: ReadLine) {}

    gatherOutputFrequency(): Promise<number> {
        return this.gatherNumber(Prompt.GATHER_OUTPUT_FREQUENCY)
    }

    gatherInput(prompt: Prompt): Promise<string> {
        return new Promise((resolve) => {
            this.readline.question(prompt, resolve)
        })
    }

    halt() {
        this.readline.write(`timer halted\n`)
    }

    resume() {
        this.readline.write(`timer resumed\n`)
    }

    quit(): Promise<string> {
        console.log(`Thanks for playing, press any key to exit.`)
        return new Promise((resolve) => {
            process.openStdin().on('keypress', resolve)
        })
    }

    private async gatherNumber(input: string): Promise<number> {
        return new Promise((resolve) => {
            this.readline.question(`${input}\n`, (answer: string) => {
                const number = parseFloat(answer)

                if (isNaN(number)) {
                    console.log(`Please enter a valid integer`)
                    resolve(this.gatherNumber(input))
                    return
                }

                resolve(number)
            })
        })
    }
}
