import { Prompt } from './prompt'

export interface GathersInput {
    gatherOutputFrequency(): Promise<number>
    gatherInput(prompt: Prompt): Promise<string>
    halt(): void
    resume(): void
    quit(): Promise<string>
}
