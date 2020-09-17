import ENoteDuration from '../Enums/ENoteDuration';

class Header {

    title: string;
    meter: string;
    composer: string;
    key: string;
    length: ENoteDuration;


    constructor(title: string, meter: string = '4/4', composer: string = 'Chongo Johngo', key: string = 'C', length: ENoteDuration = ENoteDuration.sixteenth) {
        this.title = title;
        this.meter = meter;
        this.composer = composer;
        this.key = key;
        this.length = length;
    }
    
    translateLengthToInt() {
        switch (this.length) {
            case ENoteDuration.sixteenth:
                return 16;
            default:
                throw Error('Unsupported subdivision');
        }
    }

    translateLengthToFractionString() {
        switch (this.length) {
            case ENoteDuration.sixteenth:
                return '1/16';
            default:
                throw Error('Unsupported subdivision');
        }
    }
}

export default Header;