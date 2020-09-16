class GenerateSheetMusicConfig {

    subdivision: number;
    maxConsecutiveKicks: number;
    maxNumberOfAccents: number;
    maxNoteDuration: number;
    maxRestDuration: number;
    id: number;
    

    constructor(id: number, 
                subdivision: number = 16, 
                maxConsecutiveKicks: number = 0,
                maxNoteDuration: number = 1,
                maxRestDuration:number = 0,
                maxNumberOfAccents: number = 0) {
        this.subdivision = subdivision;
        this.maxConsecutiveKicks = maxConsecutiveKicks;
        this.maxNumberOfAccents = maxNumberOfAccents;
        this.id = id;
        this.maxNoteDuration = maxNoteDuration;
        this.maxRestDuration = maxRestDuration;
    }
}

export default GenerateSheetMusicConfig;