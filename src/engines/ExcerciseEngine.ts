import GenerateSheetMusicConfig from '../models/GenerateSheetMusicConfig';
import RandomizerEngine from './RandomizerEngine';

class ExerciseEngine {
    // Main entry point All configurations should be passed in here
    public static generateNewSheetMusic = (config: GenerateSheetMusicConfig) => {
        const header = generateHeader(config.id);
        const measure = generateMeasure(config.subdivision, config.maxConsecutiveKicks, config.maxNoteDuration, config.maxRestDuration);
        const measureWithSticking = addStickingToMeasure(measure, config.maxConsecutiveKicks);
        const measureWithAccents = addAccentsToMeasure(measureWithSticking, config.maxNumberOfAccents);
        const formattedResult = format(measureWithAccents);
        return `${header}${formattedResult}`
    };
}

const generateHeader = (id: number) => {
    return `X:1\nT:Super Awesome Exercise ${id}\nM:4/4\nC:Trad.\nK:C\nL:1/16\n`
};

const format = (patternArray: string[]) => {
    let resultString = '';
    let sequenceLength = 0;
    
    // Add in the note groupings, add a space every 4 units
    patternArray.forEach((annotatedNote, index) => {
        // @ts-ignore
        const duration = annotatedNote.match(/\d/g).join("");
        sequenceLength += parseInt(duration);
        if (sequenceLength > 4) {
            resultString = `${resultString} ${annotatedNote}`;
            sequenceLength = sequenceLength % 4;
        } else {
            resultString = `${resultString}${annotatedNote}`
        }
    });
    return `|:${resultString}:|`
};

const addAccentsToMeasure = (measure: string[], accentCount: number) => {
    const accentOptions = ['', '!>!'];
    
    if (accentCount === 0) {
        return measure;
    } 
    
    const constraintFunc = (possibleSequence: string[]) => {
        let passesConstraint = true;
        possibleSequence.forEach((item) => {
            if (item.includes('!>!') && (item.includes('f,') || item.includes('z'))) {
                passesConstraint = false;
            }
        });
        return passesConstraint;
    };
    
    const insertionFunc = (note: string, accent: string) => {
        const splitNote = note.split("\"");
        if (splitNote.length === 1) {
            return `${accent}${splitNote[0]}`
        } else if (splitNote.length === 3) {
            return `"${splitNote[1]}"${accent}${splitNote[2]}`;
        } else {
            throw new Error ("WTF KIND OF NOTE ARE YOU TRYING TO ACCENT?");
        }
    };
    
    return RandomizerEngine.addRandomPropertyToRandomCollection<string, string>(measure, accentOptions, constraintFunc, insertionFunc);
};

const addStickingToMeasure = (measure: string[], maxConsecutiveKicks: number) => {
    const stickingOptions = ['R', 'L'];
    
    if (maxConsecutiveKicks > 0) {
        return measure;
    }
    
    const constraintFunc = (possibleSequence: string[]) => {
        return doesNotExceedStrokeCount(possibleSequence, 2, 'R') &&
            doesNotExceedStrokeCount(possibleSequence, 2, 'L');
    };
    
    const insertionFunc = (note: string, sticking: string) => {
        if (note.includes('z') || note.includes('f,')) {
            return `${note}`
        }
        return `"${sticking}"${note}`
    };

    return RandomizerEngine.addRandomPropertyToRandomCollection<string, string>(measure, stickingOptions, constraintFunc, insertionFunc)
};

const generateMeasure = (notesPerMeasure: number, maxConsecutiveKicks: number, longestNoteDuration: number, longestRestDuration: number) => {
    // Get our available notes. Right now can be a SNARE 'c', a KICK 'f,', or a REST 'z'
    const availableNotes = ['c'];
    const availableRests: string[] = [];
    if (maxConsecutiveKicks > 0) {
        availableNotes.push('f,');
    }
    if (longestRestDuration > 0) {
        availableRests.push('z');
    }

    /* 
    Get our note durations. 1 is 1/16 note, 2 is 1/8 note, etc.
    omitting notes over a half note for now because I don't want
    to deal with 2 digit durations
    */
    const durations = ['1', '2', '3', '4', '6', '8'];
    const availableNoteDurations: string[] = [];
    durations.forEach((duration) => {
        if (parseInt(duration) <= longestNoteDuration) {
            availableNoteDurations.push(duration);
        }
    });

    const availableRestDurations = [];
    durations.forEach((duration) => {
        if (parseInt(duration) <= longestRestDuration) {
            availableRestDurations.push(duration);
        }
    });
    
    //combine our note and duration values to get our total possible options
    const availableNotesAndDurations: string[] = [];
    availableNotes.forEach((note) => {
        availableNoteDurations.forEach((duration) => {
            availableNotesAndDurations.push(`${note}${duration}`)
        });
    });

    availableRests.forEach((rest) => {
        availableNoteDurations.forEach((duration) => {
            availableNotesAndDurations.push(`${rest}${duration}`)
        });
    });

    const constraintFunc = (possibleSequence: string[]) => {
        // figure out how long the sequence is. Duration always comes after note
        let sequenceDuration = 0;
        possibleSequence.forEach((item) => {
            // @ts-ignore
            const duration = item.match(/\d/g).join("");
            sequenceDuration += parseInt(duration);
        });
        
        // we surpassed our allowed duration, we failed our constraint
        if (sequenceDuration > notesPerMeasure) {
            return false;
        }
        
        // Do we exceed our kick count?
        return doesNotExceedStrokeCount(possibleSequence, maxConsecutiveKicks, 'f,');
    };
    
    const terminationFunc = (possibleSequence: string[]) => {
        // figure out how long the sequence is. Duration always comes after note
        let sequenceDuration = 0;
        possibleSequence.forEach((item) => {
            // @ts-ignore
            const duration = item.match(/\d/g).join("");
            sequenceDuration += parseInt(duration);
        });

        return sequenceDuration === notesPerMeasure
    };
    
    return RandomizerEngine.getRandomCollectionWithConstraint<string>(availableNotesAndDurations, constraintFunc, terminationFunc);
};

const doesNotExceedStrokeCount = (measure: string[], maximumNumber: number, strokeType: string) => {
    let consecutiveStrokes = 0;
    if (measure.length >= maximumNumber) {
        for (let i = 1; i <= measure.length; i++) {
            const note = measure[measure.length - i];
            const duration = parseInt(note.substr(note.length-1, 1));
            const isStrokeType = note.includes(strokeType);
            if (!isStrokeType || duration > 1) {
                consecutiveStrokes = 0;
            } else {
                consecutiveStrokes += 1;
            }

            // we surpassed Max kicks, we failed our constraint
            if (consecutiveStrokes > maximumNumber) {
                return false;
            }
        }
    }
    return true;
};

export default ExerciseEngine;