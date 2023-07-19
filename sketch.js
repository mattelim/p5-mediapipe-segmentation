const isFlipped = true; 

let segmentMask;
let segmentImage;
let videoImage;

const videoElement = document.getElementsByClassName("input_video")[0];
videoElement.style.display = "none";

function onSelfieSegmentationResults(results) {
  segmentMask = results.segmentationMask;
  segmentImage = results.image;
}

const selfieSegmentation = new SelfieSegmentation({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`;
  },
});

selfieSegmentation.setOptions({
  modelSelection: 1,
});
selfieSegmentation.onResults(onSelfieSegmentationResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await selfieSegmentation.send({ image: videoElement });
  },
  width: 640,
  height: 360,
});
camera.start();

function setup() {
  createCanvas(640, 360);
  videoImage = createGraphics(640, 360);
}

function draw() {
  background(0);

  if (segmentImage && segmentMask) {
    videoImage.drawingContext.save();
    videoImage.drawingContext.clearRect(0, 0, 640, 360);
    videoImage.drawingContext.drawImage(
      segmentMask,
      0,
      0,
      640,
      360
    );
    videoImage.drawingContext.globalCompositeOperation = 'source-in';
    videoImage.drawingContext.drawImage(
      segmentImage,
      0,
      0,
      640,
      360
    );
    videoImage.drawingContext.restore();
  }

  push();
  if (isFlipped) {
    translate(width, 0);
    scale(-1, 1);
  }
  displayWidth = width;
  displayHeight = (width * videoImage.height) / videoImage.width;
  image(videoImage, 0, 0, displayWidth, displayHeight);
  pop();

}