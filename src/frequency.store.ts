import { Injectable } from '@nestjs/common'

// This is intended to model a data store like a database. Since this application
// is simple we'll just keep the data in memory, but still use the repository pattern
// to showcase a more scalable architecture.
@Injectable()
export class FrequencyStore {
    // Each key is the number input by the user and each value is the frequency
    public frequencyMap: Map<BigInt, number> = new Map()
    public timeBetweenOutput = -1
    public timerInProgress = false
}
