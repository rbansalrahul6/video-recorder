import { useState } from 'react';
import { Counter } from './components/Counter';
import { Recorder, IRecorderProps } from './components/RecorderComponent';
import './App.css';

function App() {
  const [mediaType, setMediaType] = useState<IRecorderProps['mediaType']>();
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const onSelectOption = (e: any) => {
    setMediaType(e.target.value);
  };
  const renderSelection = () => (
    <>
    <p>Select the media type you want to capture and then enter submit</p>
    <select value={mediaType} onChange={onSelectOption}>
        <option disabled selected> -- select an option -- </option>
        <option value="camera">Camera</option>
        <option value="screen">Screen</option>
      </select>
      <button id="selection-btn" onClick={() => setIsOptionSelected(true)} disabled={!Boolean(mediaType)}>Submit</button>
    </>
  )

  const mediaTypeSelected = isOptionSelected && mediaType;

  return (
    <div className="App">
      {!mediaTypeSelected && renderSelection()}
      {mediaTypeSelected && mediaType === 'screen' && <Counter />}
      {mediaTypeSelected && <Recorder width="640" height="360" mediaType={mediaType} />}
    </div>
  );
}

export default App;
