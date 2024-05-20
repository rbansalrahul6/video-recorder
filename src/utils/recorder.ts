
async function getUserMediaStream(constraints: MediaStreamConstraints) {
    if (!navigator?.mediaDevices) {
        throw Error('No media device');
    }
    let stream = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);

        return stream;
    } catch (error) {
        console.log('err', error);
        throw error;
    }
}

async function getDisplayMediaStream(displayMediaOptions: DisplayMediaStreamOptions) {
    if (!navigator?.mediaDevices) {
        throw Error('No media device');
    }
    let captureStream = null;
  
    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

      return captureStream;
    } catch (err) {
      console.error(`Error: ${err}`);
      throw err;
    }
  }

function stopMediaStream(stream?: MediaStream) {
    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
    }
  }

export { getUserMediaStream, stopMediaStream, getDisplayMediaStream };
