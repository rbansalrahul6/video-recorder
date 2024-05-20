import { useRef, useState, useEffect } from "react";
import { getUserMediaStream, stopMediaStream, getDisplayMediaStream } from "../utils/recorder";
import { DEFAULT_USER_MEDIA_OPTS, DEFAULT_DISPLAY_MEDIA_OPTS, DEFAULT_FILE_NAME, DEFAULT_ERROR_MSG } from "../utils/constants";
import '../styles.css';

export interface IRecorderProps {
    width: string; /** width of video frame */
    height: string; /** height of video frame */
    mediaType?: 'camera' | 'screen'; /** To select bewteen camera or screen recording */
    showPreview?: boolean; /** To enable/disable preview */
    userMediaOpts?: MediaStreamConstraints; /** options to configure audio/video support in camera recording */
    displayMediaOpts?: DisplayMediaStreamOptions;  /** options to configure audio/video support in screen recording */
}

export const Recorder = (props: IRecorderProps) => {
    const { width, height, mediaType = 'camera', showPreview = true, userMediaOpts, displayMediaOpts } = props
    const [recordState, setRecordState] = useState<RecordingState>('inactive');
    const [fileDetail, setFileDetail] = useState({
        name: '',
        link: '',
    });
    const mediaRecorder = useRef<MediaRecorder>();
    const mediaStream = useRef<MediaStream>();
    const mediaData = useRef<Blob[]>([]);
    const previewRef = useRef<HTMLVideoElement>(null);

    const updateRecordState = () => setRecordState(mediaRecorder.current?.state ?? 'inactive');

    const saveData = () => {
        const fileName = window.prompt('Enter file name', DEFAULT_FILE_NAME);
        const blob = new Blob(mediaData.current, { type: "video/webm" });
        const videoURL = URL.createObjectURL(blob);
        setFileDetail({
            name: `${fileName}.webm`,
            link: videoURL,
        })
    };

    const onStart = () => {
        setFileDetail({
            name: '',
            link: '',
        });
        updateRecordState();
    };

    const onPause = () => {
        updateRecordState();
    };

    const onResume = () => {
        updateRecordState();
    };

    const onStop = () => {
        updateRecordState();
        saveData();
        stopMediaStream(mediaStream.current);
        cleanup();
    };

    const onDataAvailable = (e: BlobEvent) => {
        mediaData.current.push(e.data);
    };

    const onError = (err: any) => {
        window.alert(err?.message ?? DEFAULT_ERROR_MSG);
    };

    const attachListeners = () => {
        if (mediaRecorder.current) {
            // attach listeners
            mediaRecorder.current.addEventListener('start', onStart);
            mediaRecorder.current.addEventListener('pause', onPause);
            mediaRecorder.current.addEventListener('resume', onResume);
            mediaRecorder.current.addEventListener('dataavailable', onDataAvailable);
            mediaRecorder.current.addEventListener('stop',onStop);
            mediaRecorder.current.addEventListener('error', onError);
        }
    };

    const removeListeners = () => {
        if (mediaRecorder.current) {
            // remove listeners
            mediaRecorder.current.removeEventListener('start', onStart);
            mediaRecorder.current.removeEventListener('pause', onPause);
            mediaRecorder.current.removeEventListener('dataavailable', onDataAvailable);
            mediaRecorder.current.removeEventListener('stop', onStop);
            mediaRecorder.current.removeEventListener('error', onError);
        }
    };

    const cleanup = () => {
        mediaStream.current = undefined;
        mediaRecorder.current = undefined;
        mediaData.current = [];
        if (previewRef.current) {
            previewRef.current.srcObject = null;
        }
    };

    const startRecording = async () => {
        try {
            if (mediaType === 'screen') {
                mediaStream.current = await getDisplayMediaStream(displayMediaOpts ?? DEFAULT_DISPLAY_MEDIA_OPTS);
            } else {
                mediaStream.current = await getUserMediaStream(userMediaOpts ?? DEFAULT_USER_MEDIA_OPTS);
            }
            if (previewRef.current) {
                previewRef.current.srcObject = mediaStream.current;
            }
            mediaRecorder.current = new MediaRecorder(mediaStream.current, { mimeType: 'video/webm' });
            attachListeners();
            mediaRecorder.current.start();
        } catch (error: any) {
            onError(error);
        }
    };

    const pauseRecording = () => {
        mediaRecorder.current?.pause();
    };

    const resumeRecording = () => {
        mediaRecorder.current?.resume();
    };

    const stopRecording = () => {
        mediaRecorder.current?.stop();
    };

    useEffect(() => {
        return removeListeners;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
        <div className="video-panel">
            {showPreview && (<div>
                <h2>Preview</h2>
                <video width={width} height={height} autoPlay muted style={{ border: '1px solid black' }} ref={previewRef}></video>
            </div>)}
            <div>
                <h2>Recording</h2>
                <video width={width} height={height} controls src={fileDetail.link}></video>
            </div>
        </div>
        <div className="controls">
            <button className='control-button' onClick={startRecording} disabled={recordState !== 'inactive'}>Start</button>
            <button className='control-button' onClick={recordState === 'paused' ? resumeRecording : pauseRecording} disabled={recordState === 'inactive'}>{recordState === 'paused' ? 'Resume' : 'Pause'}</button>
            <button className='control-button' onClick={stopRecording} disabled={recordState !== 'recording'}>Stop</button>
        </div>
        {fileDetail.link.length > 0 && <a id="download-btn" href={fileDetail.link} download={fileDetail.name}>Download File</a>}
        </>
    );
};
