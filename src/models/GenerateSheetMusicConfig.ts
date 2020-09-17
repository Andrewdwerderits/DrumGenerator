import EStickingStyle from '../Enums/EStickingStyle';
import ENotePlacement from '../Enums/ENotePlacement';
import Header from "./Header";
import ENoteDuration from "../Enums/ENoteDuration";

class GenerateSheetMusicConfig {
    
    maxConsecutiveKicks: number;
    maxConsecutiveAccents: number;
    maxConsecutiveSnares: number;
    maxConsecutiveRests: number;
    maxConsecutiveLeftHandStickings: number;
    maxConsecutiveRightHandStickings: number;
    
    kickNoteCount: number;
    snareNoteCount: number;
    accentNoteCount: number;
    restNoteCount: number;
    
    kickNoteCountEnabled: boolean;
    snareNoteCountEnabled: boolean;
    accentNoteCountEnabled: boolean;
    restNoteCountEnabled: boolean;
    
    mandatoryKickPlacements: ENotePlacement[];
    mandatorySnarePlacements: ENotePlacement[];
    mandatoryAccentPlacements: ENotePlacement[];
    mandatoryRestPlacements: ENotePlacement[];
    
    stickingStyle: EStickingStyle;
    
    subdivision: number;
    
    header: Header;

    constructor(header: Header,
                maxConsecutiveKicks: number = 16,
                maxConsecutiveAccents: number = 16,
                maxConsecutiveSnares: number = 16,
                maxConsecutiveRests: number = 16,
                maxConsecutiveLeftHandStickings: number = 16,
                maxConsecutiveRightHandStickings: number = 16,
                kickNoteCount: number = 0,
                snareNoteCount: number = 0,
                accentNoteCount: number = 0,
                restNoteCount: number = 0,
                kickNoteCountEnabled: boolean = false,
                snareNoteCountEnabled: boolean = false,
                accentNoteCountEnabled: boolean = false,
                restNoteCountEnabled: boolean = false,
                mandatoryKickPlacements: ENotePlacement[] = [],
                mandatorySnarePlacements: ENotePlacement[] = [],
                mandatoryAccentPlacements: ENotePlacement[] = [],
                mandatoryRestPlacements: ENotePlacement[] = [],
                stickingStyle: EStickingStyle = EStickingStyle.none) {

        this.header = header;
        this.maxConsecutiveKicks = maxConsecutiveKicks;
        this.maxConsecutiveAccents = maxConsecutiveAccents;
        this.maxConsecutiveSnares = maxConsecutiveSnares;
        this.maxConsecutiveRests = maxConsecutiveRests;
        this.maxConsecutiveLeftHandStickings = maxConsecutiveLeftHandStickings;
        this.maxConsecutiveRightHandStickings = maxConsecutiveRightHandStickings;
        this.kickNoteCount = kickNoteCount;
        this.snareNoteCount = snareNoteCount;
        this.accentNoteCount = accentNoteCount;
        this.restNoteCount = restNoteCount;
        this.kickNoteCountEnabled = kickNoteCountEnabled;
        this.snareNoteCountEnabled = snareNoteCountEnabled;
        this.accentNoteCountEnabled = accentNoteCountEnabled;
        this.restNoteCountEnabled = restNoteCountEnabled;
        this.mandatoryKickPlacements = mandatoryKickPlacements;
        this.mandatorySnarePlacements = mandatorySnarePlacements;
        this.mandatoryAccentPlacements = mandatoryAccentPlacements;
        this.mandatoryRestPlacements = mandatoryRestPlacements;
        this.stickingStyle = stickingStyle;
        
        this.subdivision = this.header.translateLengthToInt();
    }
}

export default GenerateSheetMusicConfig;