import { Injectable } from '@nestjs/common'
import { FrequencyStore } from './frequency.store'

@Injectable()
export class FrequencyRepository {
    constructor(private readonly frequencyStore: FrequencyStore) {}

    insertInput(input: BigInt): void {
        const value = this.frequencyStore.frequencyMap.get(input) || 0
        this.frequencyStore.frequencyMap.set(input, value + 1)
    }

    getFrequencies(): Map<BigInt, number> {
        return this.frequencyStore.frequencyMap
    }

    setTimeBetweenOutput(time: number) {
        this.frequencyStore.timeBetweenOutput = time
    }

    getTimeBetweenOutput(): number {
        return this.frequencyStore.timeBetweenOutput
    }

    setTimerIsInProgress(inProgress: boolean): void {
        this.frequencyStore.timerInProgress = inProgress
    }

    getTimerIsInProgress(): boolean {
        return this.frequencyStore.timerInProgress
    }
}
