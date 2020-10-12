import { Injectable } from '@nestjs/common'
import { GathersInput } from './gathers-input.interface'
import { Prompt } from './prompt'

@Injectable()
export class CommandLineServiceFake implements GathersInput {
    static nextInput = `10`
    static gatherNextNumberDelay = 0

    gatherOutputFrequency(): Promise<number> {
        return Promise.resolve(parseInt(CommandLineServiceFake.nextInput))
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    gatherInput(prompt: Prompt): Promise<string> {
        return Promise.resolve(CommandLineServiceFake.nextInput)
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    halt() {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    resume() {}

    quit() {
        return Promise.resolve('f')
    }
}
