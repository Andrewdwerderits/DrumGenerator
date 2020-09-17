import Note from './Note';
import ENoteTypes from "../Enums/ENoteTypes";
import ENoteDuration from "../Enums/ENoteDuration";

class Measure {
    
    notes: Note[];
    
    constructor(subdivision: number) {
        this.notes = [];
        let noteDuration = ENoteDuration.sixteenth;
        
        switch(subdivision) {
            case 16:  
                noteDuration = ENoteDuration.sixteenth;
                break;
            case 8:
                noteDuration = ENoteDuration.eighth;
                break;
            case 4:
                noteDuration = ENoteDuration.quarter;
                break;
            case 2:
                noteDuration = ENoteDuration.half;
                break;
            default:
                throw new Error('Unsupported subdivision');
        }
        
        for (let i = 0; i < subdivision; i++) {
            this.notes.push(new Note(ENoteTypes.none, noteDuration));
        }
    }
}

export default Measure;