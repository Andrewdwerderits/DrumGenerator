import GenerateSheetMusicConfig from '../models/GenerateSheetMusicConfig';
import RandomizerEngine from './RandomizerEngine';
import Measure from '../models/Measure';
import ENoteTypes from "../Enums/ENoteTypes";
import ENotePlacement from "../Enums/ENotePlacement";
import ValidationEngine from "./ValidationEngine";
import Note from "../models/Note";
import Header from "../models/Header";
import EStickings from "../Enums/EStickings";
import EAccents from "../Enums/EAccents";

class ExerciseEngine {
    // Main entry point All configurations should be passed in here
    public static generateNewSheetMusic = (config: GenerateSheetMusicConfig) => {
        try {
            const header = generateHeaderString(config.header);
            const measure = generateMeasure(config);
            if (Array.isArray(measure)) {
                return measure;
            }
            // const measureWithSticking = addStickingToMeasure(measure, config.maxConsecutiveKicks);
            addAccentsToMeasure(measure, config);
            const formattedResult = format(measure);
            return `${header}${formattedResult}`
        } catch (e) {
            return e.message;
        }
    };
}

const generateHeaderString = (header: Header) => {
    return `X:1\nT:${header.title}\nM:${header.meter}\nC:${header.composer}\nK:${header.key}\nL:${header.translateLengthToFractionString()}\n`
};

const format = (measure: Measure) => {

    let resultString = '';
    // Add in the note groupings, add a space every 4 units
    measure.notes.forEach((note, index) => {
        let noteString = index % 4 === 0 ? ' ' : '';
        if (note.sticking === EStickings.Left) {
            noteString = noteString + `"L"`;
        }
        if (note.sticking === EStickings.Right) {
            noteString = noteString + `"R"`;
        }
        if (note.accent === EAccents.accented) {
            noteString = noteString + `!>!`;
        }
        if (note.noteType === ENoteTypes.snare) {
            noteString = noteString + 'c';
        }
        if (note.noteType === ENoteTypes.kick) {
            noteString = noteString + 'f,';
        }
        if (note.noteType === ENoteTypes.rest) {
            noteString = noteString + 'z';
        }
        resultString += noteString;
    });
    return `|:${resultString}:|`
};
//
// const addStickingToMeasure = (measure: string[], maxConsecutiveKicks: number) => {
//     const stickingOptions = ['R', 'L'];
//    
//     if (maxConsecutiveKicks > 0) {
//         return measure;
//     }
//    
//     const constraintFunc = (possibleSequence: string[]) => {
//         return doesNotExceedStrokeCount(possibleSequence, 2, 'R') &&
//             doesNotExceedStrokeCount(possibleSequence, 2, 'L');
//     };
//    
//     const insertionFunc = (note: string, sticking: string) => {
//         if (note.includes('z') || note.includes('f,')) {
//             return `${note}`
//         }
//         return `"${sticking}"${note}`
//     };
//
//     return RandomizerEngine.addRandomPropertyToRandomCollection<string, string>(measure, stickingOptions, constraintFunc, insertionFunc)
// };

// const addStickingToMeasure = (measure: Measure, config: GenerateSheetMusicConfig): Measure => {
//    
// };

const addAccentsToMeasure = (measure: Measure, config: GenerateSheetMusicConfig): Measure => {
    config.mandatoryAccentPlacements.forEach((placement) => {
        const note = measure.notes[mapNotePlacementToIndex(placement)];
        if (note.noteType === ENoteTypes.snare){
            note.accent = EAccents.accented;
        }
    });

    if (config.accentNoteCount === 0) {
        return measure;
    }

    let count = config.accentNoteCount - config.mandatoryAccentPlacements.length;
    let availableSnares = measure.notes.filter((note) => {
        return note.noteType === ENoteTypes.snare;
    });
    
    count = count > availableSnares.length ? availableSnares.length : count;
    
    if (config.accentNoteCountEnabled) {
        addNoteCountToMeasure(measure, config,null, EAccents.accented, null, randomValidUnsetAccent, count);
    }
    
    return measure;
};

const firstUnsetNoteType = (measure: Measure, config: GenerateSheetMusicConfig): Note => {
    let result = measure.notes.find((note) => {
        return note.noteType === ENoteTypes.none;
    });
    
    if (!result) {
        throw Error("No Unset Notes. Generation failure!");
    }
    return result;
};

const firstUnsetStickings = (measure: Measure): Note => {
    let result = measure.notes.find((note) => {
        return note.sticking === EStickings.None;
    });

    if (!result) {
        throw Error("No Unset Stickings. Generation failure!");
    }
    return result;
};

const randomValidUnsetAccent = (measure: Measure, config: GenerateSheetMusicConfig): Note => {
    const notesChecked: Note[] = [];
    
    while(notesChecked.length < measure.notes.length) {
        const randomIndex = RandomizerEngine.randomNumberInRange(0, measure.notes.length-1);
        const note = measure.notes[randomIndex];
        
        if (notesChecked.includes(note)) {
            continue;
        }
        
        if (note.noteType === ENoteTypes.rest || note.noteType === ENoteTypes.kick || note.noteType == ENoteTypes.none || note.accent === EAccents.accented) {
            notesChecked.push(note);
            continue;
        }
        
        const isAccentedNote = (note: Note): boolean => {
            return note.accent === EAccents.accented;
        };
        
        note.accent = EAccents.accented;
        
        if (!noteVarietyDoesNotExceedConsecutiveCount(measure, config.maxConsecutiveAccents, isAccentedNote)) {
            note.accent = EAccents.notAccented;
            notesChecked.push(note);
        } else {
            return note;
        }
    }
    
    throw Error("No place to put your accent. Generation failure!");
};

const shouldIgnoreInShufflingNotes = (note: Note) => {
    return note.placedByUser;
};

const generateMeasure = (config: GenerateSheetMusicConfig): Measure | string[] => {

    const errorList: string[] = [];
    if (!ValidationEngine.configIsValid(config, errorList)) {
        return errorList;
    }

    const measure = new Measure(config.subdivision);

    addMandatoryNotesToEmptyMeasure(measure, ENoteTypes.snare, config.mandatorySnarePlacements);
    addMandatoryNotesToEmptyMeasure(measure, ENoteTypes.kick, config.mandatoryKickPlacements);
    addMandatoryNotesToEmptyMeasure(measure, ENoteTypes.rest, config.mandatoryRestPlacements);
    
    let count = 0;
    if (config.snareNoteCountEnabled) {
        count = config.snareNoteCount - config.mandatorySnarePlacements.length;
        addNoteCountToMeasure(measure, config, ENoteTypes.snare, null, null, firstUnsetNoteType, count);
    }
    if (config.kickNoteCountEnabled) {
        count = config.kickNoteCount - config.mandatoryKickPlacements.length;
        addNoteCountToMeasure(measure, config, ENoteTypes.kick, null, null, firstUnsetNoteType, count);
    }
    if (config.restNoteCountEnabled) {
        count = config.restNoteCount - config.mandatoryRestPlacements.length;
        addNoteCountToMeasure(measure, config, ENoteTypes.rest, null, null, firstUnsetNoteType, count);
    }

    //shuffle
    RandomizerEngine.shuffleArray<Note>(measure.notes, shouldIgnoreInShufflingNotes);

    // fill in remaining notes
    const remainingNotes = measure.notes.filter((note) => {
        return note.noteType === ENoteTypes.none;
    });

    remainingNotes.forEach((note) => {
        const optionsChecked: ENoteTypes[] = [];
        let acceptableNoteFound = false;

        while (!acceptableNoteFound) {
            if (optionsChecked.length === 3) {
                throw new Error("No where to place note. Generation failure!");
            }

            const randomIndex = RandomizerEngine.randomNumberInRange(0, 2);
            const noteType = randomIndex === 0 ? ENoteTypes.snare : randomIndex === 1 ? ENoteTypes.kick : ENoteTypes.rest;
            if (!optionsChecked.includes(noteType)) {
                note.noteType = noteType;

                let maximumNumber = 0;
                switch (noteType) {
                    case ENoteTypes.snare:
                        if (config.snareNoteCountEnabled) {
                            note.noteType = ENoteTypes.none;
                            optionsChecked.push(noteType);
                            continue;
                        }
                        maximumNumber = config.maxConsecutiveSnares;
                        break;
                    case ENoteTypes.kick:
                        if (config.kickNoteCountEnabled) {
                            note.noteType = ENoteTypes.none;
                            optionsChecked.push(noteType);
                            continue;
                        }
                        maximumNumber = config.maxConsecutiveKicks;
                        break;
                    case ENoteTypes.rest:
                        if (config.restNoteCountEnabled) {
                            note.noteType = ENoteTypes.none;
                            optionsChecked.push(noteType);
                            continue;
                        }
                        maximumNumber = config.maxConsecutiveRests;
                        break;
                }
                
                const noteIsSameNoteType = (note: Note): boolean => {
                    return note.noteType === noteType;
                };

                if (!noteVarietyDoesNotExceedConsecutiveCount(measure, maximumNumber, noteIsSameNoteType)) {
                    note.noteType = ENoteTypes.none;
                    optionsChecked.push(noteType);
                } else {
                    acceptableNoteFound = true;
                }
            }
        }
    });

    return measure;
};

const addMandatoryNotesToEmptyMeasure = (measure: Measure, noteType: ENoteTypes, mandatoryNotes: ENotePlacement[]) => {
    mandatoryNotes.forEach((placement) => {
        const index = mapNotePlacementToIndex(placement);
        const noteAtIndex = measure.notes[index];

        noteAtIndex.placedByUser = true;
        noteAtIndex.noteType = noteType;
    });
};

const addNoteCountToMeasure = (measure: Measure,
                               config: GenerateSheetMusicConfig,
                               noteType: ENoteTypes | null, 
                               accent: EAccents | null,
                               sticking: EStickings | null, 
                               getNoteToUpdate: (measure: Measure, config: GenerateSheetMusicConfig) => Note,
                               count: number) => {
    for (let i = 0; i < count; i++) {
        const noteToUpdate = getNoteToUpdate(measure, config);
        noteToUpdate.noteType = noteType == null ? noteToUpdate.noteType : noteType;
        noteToUpdate.accent = accent == null ? noteToUpdate.accent : accent;
        noteToUpdate.sticking = sticking == null ? noteToUpdate.sticking : sticking;
    }
};

const mapNotePlacementToIndex = (placement: ENotePlacement) => {
    switch (placement) {
        case ENotePlacement.one:
            return 0;
        case ENotePlacement.oneE:
            return 1;
        case ENotePlacement.oneAnd:
            return 2;
        case ENotePlacement.oneA:
            return 3;
        case ENotePlacement.two:
            return 4;
        case ENotePlacement.twoE:
            return 5;
        case ENotePlacement.twoAnd:
            return 6;
        case ENotePlacement.twoA:
            return 7;
        case ENotePlacement.three:
            return 8;
        case ENotePlacement.threeE:
            return 9;
        case ENotePlacement.threeAnd:
            return 10;
        case ENotePlacement.threeA:
            return 11;
        case ENotePlacement.four:
            return 12;
        case ENotePlacement.fourE:
            return 13;
        case ENotePlacement.fourAnd:
            return 14;
        case ENotePlacement.fourA:
            return 15;
    }
};

const noteVarietyDoesNotExceedConsecutiveCount = (measure: Measure, maximumNumber: number, isNoteVariety: (note: Note) => boolean) => {
    let consecutiveCount = 0;
    let hasNotSurpassedConsecutiveCount = true;
    measure.notes.forEach((note) => {
        if (isNoteVariety(note)) {
            consecutiveCount += 1;
        } else {
            consecutiveCount = 0;
        }
        
        if (consecutiveCount > maximumNumber) {
            hasNotSurpassedConsecutiveCount = false;
        }
    });
    return hasNotSurpassedConsecutiveCount;
};

export default ExerciseEngine;