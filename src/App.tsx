import React, {useState} from 'react';
import './App.css';
import 'font-awesome/css/font-awesome.min.css';
import Abcjs from 'react-abcjs';
import Exercise from './models/Exercise';
import ExerciseEngine from './engines/ExcerciseEngine';
import GenerateSheetMusicConfig from './models/GenerateSheetMusicConfig';

function App() {
    const [savedExercises, setSavedExercises] = useState<Exercise[]>([new Exercise(`X:1\nT:Paradiddles\nM:4/4\nC:Trad.\nK:C\nL:1/16\n|:"R"c"L"c"R"c"R"c "L"c"R"c"L"c"L"c "R"c"L"c"R"c"R"c "L"c"R"c"L"c"L"c:|`)]);
    const [currentExercise, setCurrentExercise] = useState<Exercise>();
    const [maxConsecutiveKicks, setMaxConsecutiveKicks] = useState(0);
    const [maxNumberOfAccents, setMaxNumberOfAccents] = useState(0);
    const [maxNoteDuration, setMaxNoteDuration] = useState(1);
    const [maxRestDuration, setMaxRestDuration] = useState(0);

    const [exercisesGenerated, setExercisesGenerated] = useState(1);

    const config = new GenerateSheetMusicConfig(exercisesGenerated, 16, maxConsecutiveKicks, maxNoteDuration, maxRestDuration, maxNumberOfAccents);

    const updateMaxConsecutiveKicks = (event: any) => {
        setMaxConsecutiveKicks(parseInt(event.target.value));
    };

    const updateAccentCount = (event: any) => {
        setMaxNumberOfAccents(parseInt(event.target.value));
    };

    const updateNoteDuration = (event: any) => {
        setMaxNoteDuration(parseInt(event.target.value));
    };

    const updateRestDuration = (event: any) => {
        setMaxRestDuration(parseInt(event.target.value));
    };

    const saveExercise = () => {
        if (currentExercise) {
            setSavedExercises([...savedExercises, currentExercise]);
            setExercisesGenerated(exercisesGenerated + 1);
        }
    };

    const generateNewExercise = () => {
        const newExercise = new Exercise(ExerciseEngine.generateNewSheetMusic(config));
        setCurrentExercise(newExercise);
    };

    // @ts-ignore
    return (
        <div className="App">
            <header>
                <div className='App-header'>COOL MUSIC GENERATION WEBSITE</div>
                {savedExercises.map((exercise) => {
                    const deleteCallback = () => {
                        const firstIndexOfExercise = savedExercises.indexOf(exercise);
                        const savedExercisesCopy = [...savedExercises];
                        savedExercisesCopy.splice(firstIndexOfExercise, 1);
                        setSavedExercises(savedExercisesCopy);
                    };
                    return (
                        <div>
                            <Abcjs
                                abcNotation={exercise.sheetMusic}
                                parserParams={{}}
                                engraverParams={{responsive: 'resize'}}
                                renderParams={{viewportHorizontal: true}}
                            />
                            <button onClick={deleteCallback}>Delete</button>
                        </div>
                    );
                })}
            </header>
            <div className={'App-header'}>CURRENT EXERCISE</div>
            {currentExercise &&
            <Abcjs
                abcNotation={currentExercise.sheetMusic}
                parserParams={{}}
                engraverParams={{responsive: 'resize'}}
                renderParams={{viewportHorizontal: true}}
            />
            }
            <button onClick={generateNewExercise}>Generate Pattern</button>
            <button onClick={saveExercise}>SAVE</button>
            <div>
                <div>Maximum Number of Consecutive Kicks</div>
                <input type='number' value={maxConsecutiveKicks} onChange={updateMaxConsecutiveKicks}/>
            </div>
            <div>
                <div>Maximum Number of Accents</div>
                <input type='number' value={maxNumberOfAccents} onChange={updateAccentCount}/>
            </div>
            <div>
                <div>Maximum Duration of Notes</div>
                <input type='number' value={maxNoteDuration} onChange={updateNoteDuration}/>
            </div>
            <div>
                <div>Maximum Duration of Rests</div>
                <input type='number' value={maxRestDuration} onChange={updateRestDuration}/>
            </div>
        </div>
    );
}

export default App;
