import {
    Card,
    CardContent,
    FormControl, FormControlLabel, FormGroup,
    FormLabel,
    InputLabel,
    MenuItem,
    Paper, Radio,
    RadioGroup,
    Select, Switch
} from "@material-ui/core";
import React, {useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import GenerateSheetMusicConfig from "../models/GenerateSheetMusicConfig";
import ENotePlacement from "../Enums/ENotePlacement";

interface RadioButtonArrayTabProps {
    config: GenerateSheetMusicConfig;
    setConfig: (arg: GenerateSheetMusicConfig) => void;
    selection: string;
    setSelection: (arg: string) => void;
    mode: string;
}

export default function RadioButtonArrayTab(props: RadioButtonArrayTabProps) {

    const { config, setConfig, selection, setSelection, mode } = props;

    const getConfigFieldFromSelection = (selection: string, mode: string, config: GenerateSheetMusicConfig) => {
        let value = '2';
        switch (selection) {
            case 'snare':
                return mode === 'consecutive' ? config.maxConsecutiveSnares.toString() : config.snareNoteCount.toString();
            case 'kick':
                return mode === 'consecutive' ? config.maxConsecutiveKicks.toString() : config.kickNoteCount.toString();
            case 'rests':
                return mode === 'consecutive' ? config.maxConsecutiveRests.toString() : config.restNoteCount.toString();
            case 'accents':
                return mode === 'consecutive' ? config.maxConsecutiveAccents.toString() : config.accentNoteCount.toString();
        }
    };

    const setConfigFieldFromSelection = (value: number, selection: string, mode: string, config: GenerateSheetMusicConfig) => {
        switch (selection) {
            case 'snare':
                mode === 'consecutive' ? config.maxConsecutiveSnares = value : config.snareNoteCount = value;
                break;
            case 'kick':
                mode === 'consecutive' ? config.maxConsecutiveKicks = value : config.kickNoteCount = value;
                break;
            case 'rests':
                mode === 'consecutive' ? config.maxConsecutiveRests = value : config.restNoteCount = value;
                break;
            case 'accents':
                mode === 'consecutive' ? config.maxConsecutiveAccents = value : config.accentNoteCount = value;
                break;
        }
    };
    
    const onChange = (event: any) => {
        
        setConfigFieldFromSelection(parseInt(event.target.value), selection, mode, config);
        let newConfig = {...config, header: config.header};
        setConfig(newConfig);
    };

    const selectionChange = (event: any) => {
        setSelection(event.target.value);
    };
    
    const handleCheckbox = (event: any) => {
        switch (selection) {
            case 'snare':
                config.snareNoteCountEnabled = event.target.checked;
                break;
            case 'kick':
                config.kickNoteCountEnabled = event.target.checked;
                break;
            case 'accents':
                config.accentNoteCountEnabled = event.target.checked;
                break;
            case 'rests':
                config.restNoteCountEnabled = event.target.checked;
                break;
        }

        let newConfig = {...config, header: config.header};
        setConfig(newConfig);
    };

    let value = getConfigFieldFromSelection(selection, mode, config);

    let checked = false;
    switch (selection) {
        case 'snare':
            checked = config.snareNoteCountEnabled;
            break;
        case 'kick':
            checked = config.kickNoteCountEnabled;
            break;
        case 'accents':
            checked = config.accentNoteCountEnabled;
            break;
        case 'rests':
            checked = config.restNoteCountEnabled;
            break;
    }
    
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '& > *': {
                    margin: theme.spacing(1),
                },
            },
            formControl: {
                margin: theme.spacing(1),
                minWidth: 120,
            },
            cardRoot: {
                minWidth: 275,
            },
            bullet: {
                display: 'inline-block',
                margin: '0 2px',
                transform: 'scale(0.8)',
            },
            title: {
                fontSize: 14,
            },
            pos: {
                marginBottom: 12,
            },
        }),
    );
    const classes = useStyles();
    
    return (
        <Card className={classes.cardRoot}>
            <CardContent>
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Hit Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selection}
                        onChange={selectionChange}
                    >
                        <MenuItem value={'snare'}>Snare</MenuItem>
                        <MenuItem value={'kick'}>Kick</MenuItem>
                        <MenuItem value={'rests'}>Rests</MenuItem>
                        <MenuItem value={'accents'}>Accents</MenuItem>
                    </Select>
                    {mode !== 'consecutive' &&
                    <FormControlLabel label="Enable" control={<Switch checked={checked} onChange={handleCheckbox} name="enable"/>}/>}
                </FormControl>
                <FormControl component="fieldset">
                    {mode === 'consecutive' &&
                    <FormLabel component="legend">Maximum Number of Consecutive Hits Allowed</FormLabel>}
                    {mode !== 'consecutive' &&
                        <FormLabel component="legend">Exact Number of Hits Allowed</FormLabel>}
                    <RadioGroup aria-label="gender" name="gender1" value={value} onChange={onChange}>
                        <Paper>
                            {mode !== 'consecutive' &&
                            <FormControlLabel value="0" control={<Radio/>} label="0"/>}
                            <FormControlLabel value="1" control={<Radio/>} label="1"/>
                            <FormControlLabel value="2" control={<Radio/>} label="2"/>
                            <FormControlLabel value="3" control={<Radio/>} label="3"/>
                            <FormControlLabel value="4" control={<Radio/>} label="4"/>
                        </Paper>
                        <Paper>
                            <FormControlLabel value="5" control={<Radio/>} label="5"/>
                            <FormControlLabel value="6" control={<Radio/>} label="6"/>
                            <FormControlLabel value="7" control={<Radio/>} label="7"/>
                            <FormControlLabel value="8" control={<Radio/>} label="8"/>
                        </Paper>
                        <Paper>
                            <FormControlLabel value="9" control={<Radio/>} label="9"/>
                            <FormControlLabel value="10" control={<Radio/>} label="10"/>
                            <FormControlLabel value="11" control={<Radio/>} label="11"/>
                            <FormControlLabel value="12" control={<Radio/>} label="12"/>
                        </Paper>
                        <Paper>
                            <FormControlLabel value="13" control={<Radio/>} label="13"/>
                            <FormControlLabel value="14" control={<Radio/>} label="14"/>
                            <FormControlLabel value="15" control={<Radio/>} label="15"/>
                            <FormControlLabel value="16" control={<Radio/>} label="16"/>
                        </Paper>
                    </RadioGroup>
                </FormControl>
            </CardContent>
        </Card>
    );
}