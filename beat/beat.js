// Set up the context and source
const audioContext = new AudioContext();
const sourceNode = audioContext.createBufferSource();
sourceNode.loop = true;
sourceNode.connect(audioContext.destination);
// Fetch the file and write to an audio buffer
fetch('call.flac')
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
  .then(audioBuffer => {
    sourceNode.buffer = audioBuffer;
    return sourceNode;
  })
  .then(node => process(node))
  .catch(e => console.error(e))

function process(sourceNode) {
  // Get the channels and their squares
  const leftCh = sourceNode.buffer.getChannelData(0);
  const rightCh = sourceNode.buffer.getChannelData(1);
  const leftChSq = leftCh.map(x => Math.pow(x, 2));
  const rightChSq = rightCh.map(x => Math.pow(x, 2));
  const stereoSq = leftChSq.map((x, i) => x + rightChSq[i]);
  sourceNode.start();
}

