import { Injectable } from '@nestjs/common'
import { FrequencyRepository } from './frequency.repository'

@Injectable()
export class TimerService {
    constructor(private readonly frequencyRepository: FrequencyRepository) {}

    addInput(input: BigInt): void {
        this.frequencyRepository.insertInput(input)
    }

    halt() {
        this.frequencyRepository.setTimerIsInProgress(false)
    }

    resume() {
        this.frequencyRepository.setTimerIsInProgress(true)
        this.runFrequencyTimer()
    }

    quit() {
        this.frequencyRepository.setTimerIsInProgress(false)
        this.printFrequencies()
    }

    setTimeIntervalForFrequencyOutput(time: number): void {
        if (time > 0) {
            this.frequencyRepository.setTimeBetweenOutput(time)
            this.frequencyRepository.setTimerIsInProgress(true)
            this.runFrequencyTimer()
        }
    }

    runFrequencyTimer(): void {
        setTimeout(() => {
            if (this.frequencyRepository.getTimerIsInProgress()) {
                this.printFrequencies()
                this.runFrequencyTimer()
            }
        }, this.frequencyRepository.getTimeBetweenOutput() * 1000)
    }

    numberIsInFibonacciSequence(input: BigInt): boolean {
        let firstFibonacciNumber = 0n
        let secondFibonacciNumber = 1n
        let currentFibonacciNumber = 0n
        let fibonacciNumbersComputed = 0n

        while (fibonacciNumbersComputed < 1000) {
            if (currentFibonacciNumber === input) {
                return true
            }

            if (currentFibonacciNumber > input) {
                return false
            }

            currentFibonacciNumber = BigInt(firstFibonacciNumber + secondFibonacciNumber)
            firstFibonacciNumber = BigInt(secondFibonacciNumber)
            secondFibonacciNumber = currentFibonacciNumber
            fibonacciNumbersComputed++
        }

        return false
    }

    private printFrequencies() {
        const frequencyMap = this.frequencyRepository.getFrequencies()
        const frequencies = [...frequencyMap.keys()]
        const frequencyList = frequencies.map((frequency) => `${frequency}:${frequencyMap.get(frequency)}`)
        const formattedOutput = frequencyList.reduce((acc, value) => (acc === '' ? value : `${acc}, ${value}`), ``)

        if (formattedOutput.length > 0) {
            console.log(formattedOutput)
        }
    }
}
