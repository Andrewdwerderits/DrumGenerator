import EAccents from '../Enums/EAccents';
import ENoteTypes from '../Enums/ENoteTypes';
import EStickings from '../Enums/EStickings';
import ENoteDuration from '../Enums/ENoteDuration';

class Note {

    sticking: EStickings;
    accent: EAccents;
    noteType: ENoteTypes;
    duration: ENoteDuration;
    placedByUser: boolean;

    constructor(noteType = ENoteTypes.rest, duration: ENoteDuration = ENoteDuration.sixteenth, sticking: EStickings = EStickings.None, accent = EAccents.notAccented, placedByUser: boolean = false) {
        this.noteType = noteType;
        this.sticking = sticking;
        this.accent = accent;
        this.duration = duration;
        this.placedByUser = placedByUser;
    }
}

export default Note;