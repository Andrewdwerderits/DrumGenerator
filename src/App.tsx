import React, {useEffect, useState} from 'react';
import './App.css';
import 'font-awesome/css/font-awesome.min.css';
import Abcjs from 'react-abcjs';
import Exercise from './models/Exercise';
import ExerciseEngine from './engines/ExcerciseEngine';
import GenerateSheetMusicConfig from './models/GenerateSheetMusicConfig';
import Header from "./models/Header";
import RadioButtonArrayTab from './commonComponents/RadioButtonArrayTab';
import {
    Tabs,
    AppBar,
    Tab,
    Typography,
    Box,
    Switch,
    FormControlLabel,
    FormLabel,
    FormControl,
    FormGroup,
    FormHelperText,
    MenuItem,
    Select,
    InputLabel,
    TextField,
    CardContent,
    Card, CardActions, Tooltip
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SwitchArrayTab from "./commonComponents/SwitchArrayTab";
import ValidationEngine from "./engines/ValidationEngine";

function App() {
    const [savedExercises, setSavedExercises] = useState<Exercise[]>([new Exercise(`X:1\nT:Paradiddles\nM:4/4\nC:Trad.\nK:C\nL:1/16\n|:"R"c"L"c"R"c"R"c "L"c"R"c"L"c"L"c "R"c"L"c"R"c"R"c "L"c"R"c"L"c"L"c:|`), new Exercise(`X:1\nT:Doubles\nM:4/4\nC:Trad.\nK:C\nL:1/16\n|:"R"c"R"c"L"c"L"c "R"c"R"c"L"c"L"c "R"c"R"c"L"c"L"c "R"c"R"c"L"c"L"c:|`)]);
    const [currentExercise, setCurrentExercise] = useState<Exercise>();
    const [exercisesGenerated, setExercisesGenerated] = useState(1);
    const [config, setConfig] = useState<GenerateSheetMusicConfig>(new GenerateSheetMusicConfig(new Header(`Super Dope Title ${exercisesGenerated}`),));

    const [tabIndex, setTabIndex] = useState(0);

    const [consecutiveHitsSelection, setConsecutiveHitsSelection] = useState('kick');
    const [noteCountSelection, setNoteCountSelection] = useState('kick');
    const [mandatoryNotePlacementSelection, setMandatoryNotePlacementSelection] = useState('kick');
    const [stickingSelection, setStickingSelection] = useState('none');

    const [measureName, setMeasureName] = useState("Greatest Measure of All Time");
    const [errorList, setErrorList] = useState<string[]>([]);

    useEffect(() => {
        config.header.title = measureName;
        let newConfig = {...config, header: config.header};
        setConfig(newConfig);
    }, [measureName]);
    
    useEffect(() => {
        const newErrorList: string[] = [];
        ValidationEngine.configIsValid(config, newErrorList);
        setErrorList(newErrorList);
    }, [config]);

    const saveExercise = () => {
        if (currentExercise) {
            setSavedExercises([...savedExercises, currentExercise]);
            setExercisesGenerated(exercisesGenerated + 1);
        }
    };

    const generateNewExercise = () => {
        const measure = ExerciseEngine.generateNewSheetMusic(config);
        if (Array.isArray(measure)) {
            setErrorList(measure);
            return;
        }
        const newExercise = new Exercise(measure);
        setCurrentExercise(newExercise);
    };

    const stickingSelectionChange = (event: any) => {
        setStickingSelection(event.target.value);
    };

    const measureNameChange = (event: any) => {
        setMeasureName(event.target.value);
    };

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
            toolTip: {
                fontSize: 20,
            }
        }),
    );
    const classes = useStyles();

    interface TabPanelProps {
        children?: React.ReactNode;
        index: any;
        value: any;
    }

    function TabPanel(props: TabPanelProps) {
        const {children, value, index, ...other} = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={3}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    function a11yProps(index: any) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
    };

    // @ts-ignore
    // @ts-ignore
    return (
        <div className="App">
            <header>
            </header>
            <div className='App-header'>COOL DRUM BEAT GENERATION WEBSITE</div>
            <Card className={classes.cardRoot}>
                <CardContent>
                    {savedExercises.map((exercise) => {
                        const deleteCallback = () => {
                            const firstIndexOfExercise = savedExercises.indexOf(exercise);
                            const savedExercisesCopy = [...savedExercises];
                            savedExercisesCopy.splice(firstIndexOfExercise, 1);
                            setSavedExercises(savedExercisesCopy);
                        };
                        return (
                            <Card className={classes.cardRoot}>
                                <CardContent>
                                    <div>
                                        <Abcjs
                                            abcNotation={exercise.sheetMusic}
                                            parserParams={{}}
                                            engraverParams={{responsive: 'resize'}}
                                            renderParams={{viewportHorizontal: true}}
                                        />
                                        <Button variant="contained" color="secondary"
                                                onClick={deleteCallback}>Delete</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </CardContent>
            </Card>
            {currentExercise &&
            <Card className={classes.cardRoot}>
                <CardContent>
                    <Abcjs
                        abcNotation={currentExercise.sheetMusic}
                        parserParams={{}}
                        engraverParams={{responsive: 'resize'}}
                        renderParams={{viewportHorizontal: true}}
                    />
                </CardContent>
            </Card>
            }
            <AppBar position="static">
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Maximum Consecutive Number of Hit" {...a11yProps(0)} />
                    <Tab label="Exact Number Of Each Hit Per Measure" {...a11yProps(1)} />
                    <Tab label="Specify Specific Note Placements" {...a11yProps(2)} />
                    <Tab label="Sticking Style" {...a11yProps(3)} />
                </Tabs>
            </AppBar>
            <TabPanel value={tabIndex} index={0}>
                <RadioButtonArrayTab mode={'consecutive'} selection={consecutiveHitsSelection}
                                     setSelection={setConsecutiveHitsSelection} config={config} setConfig={setConfig}/>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <RadioButtonArrayTab mode={'noteCount'} selection={noteCountSelection}
                                     setSelection={setNoteCountSelection} config={config} setConfig={setConfig}/>
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                <SwitchArrayTab selection={mandatoryNotePlacementSelection}
                                setSelection={setMandatoryNotePlacementSelection} config={config}
                                setConfig={setConfig}/>
            </TabPanel>
            <TabPanel value={tabIndex} index={3}>
                <Card className={classes.cardRoot}>
                    <CardContent>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Sticking Pattern</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={stickingSelection}
                                onChange={stickingSelectionChange}
                            >
                                <MenuItem value={'none'}>None</MenuItem>
                                <MenuItem value={'natural'}>Natural</MenuItem>
                                <MenuItem value={'alternating'}>Alternating</MenuItem>
                                <MenuItem value={'random'}>Random</MenuItem>
                            </Select>
                        </FormControl>
                    </CardContent>
                </Card>
            </TabPanel>
            <Card className={classes.cardRoot}>
                <CardContent>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Generation Controls</FormLabel>
                        <TextField value={measureName} onChange={measureNameChange} id="standard-basic"
                                   label="Pattern Name"/>
                        <CardActions>
                            <Tooltip title={<span style={{ fontSize: '18px'}}>{errorList}</span>}>
                                <span style={{ cursor: 'not-allowed' }}>
                                <Button disabled={errorList.length > 0} variant="contained"
                                        onClick={generateNewExercise}>Generate Measure</Button>
                                </span>
                            </Tooltip>
                            <Button variant="contained" color="primary" onClick={saveExercise}>SAVE</Button>
                        </CardActions>
                    </FormControl>
                </CardContent>
            </Card>
        </div>
    );
}

export default App;
