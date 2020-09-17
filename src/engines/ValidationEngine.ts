import GenerateSheetMusicConfig from "../models/GenerateSheetMusicConfig";

class ValidationEngine {

    public static configIsValid = (config: GenerateSheetMusicConfig, errorList: string[]): boolean => {
        const notePlacementsValid = ValidationEngine.notePlacementsAreValid(config, errorList);
        const maxConsecutiveNotesValid: boolean = ValidationEngine.maxConsecutiveNotesAreValid(config, errorList);
        const noteCountsValid: boolean = ValidationEngine.noteCountsAreValid(config, errorList);
        const notePlacementsDoNotExceedCounts = ValidationEngine.notePlacementsDoNotExceedNoteCounts(config, errorList);

        return notePlacementsValid && maxConsecutiveNotesValid && noteCountsValid && notePlacementsDoNotExceedCounts;

    };

    private static noteCountsAreValid = (config: GenerateSheetMusicConfig, errorList: string[]): boolean => {
        // for the lifetime of this function:
        // -1 means any amount of that note is allowed
        // 0 means the note is disabled
        // 1+ means there are exactly that many notes of the type
        
        const subdivision = config.subdivision;
        let result = true;

        const snares = config.snareNoteCountEnabled ? config.snareNoteCount : -1;
        const kicks = config.kickNoteCountEnabled ? config.kickNoteCount : -1;
        const rests = config.restNoteCountEnabled ? config.restNoteCount : -1;
        const accents = config.accentNoteCountEnabled ? config.accentNoteCount : -1;

        // all note counts are disabled, auto valid
        if (snares === -1 && kicks === -1 && rests === -1 && accents === -1) {
            result = true;
        }

        // nothing in enabled!
        if (snares === 0 && rests === 0 && kicks === 0){
            errorList.push('All Note Counts set to zero. ');
            result = false;
        }

        // an option is too big
        if (snares > subdivision || kicks > subdivision || accents > subdivision || rests > subdivision) {
            errorList.push('One of your exact note counts is higher than your subdivision. ');
            result = false
        }

        // // if you specify kicks and snares and rests, you have specified everything so it must equal the subdivision
        if ((snares >= 0 && kicks >= 0 && rests >= 0) && (snares + kicks + rests !== subdivision)) {
            errorList.push('You have all note types specified but they do not add up to your subdivision. ');
            result = false;
        }

        // if you have accents specified, it can't exceed the available room for snares
        if (accents > snares && snares !== -1) {
            errorList.push('You have more accents specified than snares, not all notes can be accented. ');
            result = false
        }
        
        if (!(snares + kicks + rests <= subdivision)) {
            errorList.push('You have more notes specified than allowed in a measure per the subdivision. ');
            result = false
        }

        return result;
    };

    private static maxConsecutiveNotesAreValid = (config: GenerateSheetMusicConfig, errorList: string[]): boolean => {
        const snares = config.maxConsecutiveSnares;
        const kicks = config.maxConsecutiveKicks;
        const accents = config.maxConsecutiveAccents;
        const rests = config.maxConsecutiveRests;
        const lefts = config.maxConsecutiveLeftHandStickings;
        const rights = config.maxConsecutiveRightHandStickings;

        // any max consecutive is fine, but you can't have 0. Use noteCount to turn off a note Type
        if (snares === 0 || kicks === 0 || accents === 0 || rests === 0 || lefts === 0 || rights === 0) {
            errorList.push('You cannot set maxConsecutive to 0. Use Note Count toggle to turn off a note type. ');
            return false;
        }
        return true;
    };

    private static notePlacementsAreValid = (config: GenerateSheetMusicConfig, errorList: string[]): boolean => {
        const snares = config.mandatorySnarePlacements;
        const kicks = config.mandatoryKickPlacements;
        const accents = config.mandatoryAccentPlacements;
        const rests = config.mandatoryRestPlacements;
        
        const subdivision = config.subdivision;
        let result = true;

        // nobody can have more than available notes
        if (snares.length > subdivision || kicks.length > subdivision || accents.length > subdivision || rests.length > subdivision) {
            errorList.push('One of your mandatory notes placed is bigger than your subdivision allows. ');
            result = false
        }

        // kicks/snares/rests are mutually exclusive right now
        // TODO: Refactor for non-linear patterns
        if (snares.length + kicks.length + rests.length > subdivision) {
            errorList.push('You have more mandatory notes placed than your subdivision allows. ');
            result = false
        }

        // check for duplicates
        const snareHasDuplicates = (new Set(snares)).size !== snares.length;
        const kicksHasDuplicates = (new Set(kicks)).size !== kicks.length;
        const accentsHasDuplicates = (new Set(accents)).size !== accents.length;
        const restsHasDuplicates = (new Set(rests)).size !== rests.length;

        if (snareHasDuplicates || kicksHasDuplicates || accentsHasDuplicates || restsHasDuplicates) {
            errorList.push('One of your mandatory note placements has duplicates. ');
            result = false
        }

        // can't have overlapping notes right now
        const overlappingSnareAndKickNotes = snares.filter(value => kicks.includes(value));
        const overlappingSnareAndRestNotes = snares.filter(value => rests.includes(value));
        const overlappingKickAndSnareNotes = kicks.filter(value => snares.includes(value));
        const overlappingKickAndRestNotes = kicks.filter(value => rests.includes(value));
        const overlappingRestAndSnareNotes = rests.filter(value => snares.includes(value));
        const overlappingRestAndKickNotes = rests.filter(value => kicks.includes(value));

        if (!(overlappingSnareAndKickNotes.length === 0 &&
            overlappingSnareAndRestNotes.length === 0 &&
            overlappingKickAndSnareNotes.length === 0 &&
            overlappingKickAndRestNotes.length === 0 &&
            overlappingRestAndSnareNotes.length === 0 &&
            overlappingRestAndKickNotes.length === 0)) {
            
            errorList.push('Two note types have the same placement. ');
            result = false;
        }
        
        return result;
    };

    private static notePlacementsDoNotExceedNoteCounts = (config: GenerateSheetMusicConfig, errorList: string[]) => {
        const snarePlacements = config.mandatorySnarePlacements;
        const kickPlacements = config.mandatoryKickPlacements;
        const accentPlacements = config.mandatoryAccentPlacements;
        const restPlacements = config.mandatoryRestPlacements;
        const snares = config.snareNoteCount;
        const kicks = config.kickNoteCount;
        const rests = config.restNoteCount;
        const accents = config.accentNoteCount;

        const snaresValid = snarePlacements.length <= snares || !config.snareNoteCountEnabled;
        const kicksValid = kickPlacements.length <= kicks || !config.kickNoteCountEnabled;
        const accentsValid = accentPlacements.length <= accents || !config.accentNoteCountEnabled;
        const restsValid = restPlacements.length <= rests || !config.restNoteCountEnabled;

        if (!(snaresValid && kicksValid && restsValid && accentsValid)) {
            errorList.push('If you have exact note count turned on, it must be higher than the number of exact placements you specify. ');
            return false;
        }
        
        return true;
    };
}

export default ValidationEngine;