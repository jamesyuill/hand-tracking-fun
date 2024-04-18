let handpose;
let video;
let hands = [];
let history = [];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  const options = {
    num_hands: 2,
  };

  handpose = ml5.handpose(video, options, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on('hand', (results) => {
    hands = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log('Model ready!');
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  //   drawKeypoints(); // draws points one landmarks
  drawKeyLines();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < hands.length; i += 1) {
    const hand = hands[i];
    for (let j = 0; j < hand.landmarks.length; j += 1) {
      const keypoint = hand.landmarks[j];
      fill(255, 0, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10);
    }
  }
}

function drawKeyLines() {
  for (let i = 0; i < hands.length; i += 1) {
    const hand = hands[i];
    stroke(0, 255, 0);
    let thumb = createVector(hand.landmarks[4][0], hand.landmarks[4][1]);
    let fingOne = createVector(hand.landmarks[8][0], hand.landmarks[8][1]);
    let fingTwo = createVector(hand.landmarks[12][0], hand.landmarks[12][1]);
    let fingThree = createVector(hand.landmarks[16][0], hand.landmarks[16][1]);
    let fingFour = createVector(hand.landmarks[20][0], hand.landmarks[20][1]);

    fill(255);
    noStroke();
    ellipse(thumb.x, thumb.y, 10);
    ellipse(fingOne.x, fingOne.y, 10);
    ellipse(fingTwo.x, fingTwo.y, 10);
    ellipse(fingThree.x, fingThree.y, 10);
    ellipse(fingFour.x, fingFour.y, 10);

    // line(thumb.x, thumb.y, index.x, index.y);

    let fingOneDist = p5.Vector.dist(thumb, fingOne);
    let fingTwoDist = p5.Vector.dist(thumb, fingTwo);
    let fingThreeDist = p5.Vector.dist(thumb, fingThree);
    let fingFourDist = p5.Vector.dist(thumb, fingFour);

    let fromColor = color('red');
    let toColor = color('blue');
    let colorchange = lerpColor(fromColor, toColor, thumb.y / 450);
    circleX = (thumb.x + fingOne.x) / 2;
    circleY = (thumb.y + fingOne.y) / 2;

    // fill(colorchange);
    // ellipse(circleX, circleY, fingOneDist / 2);
    // textSize(fingOneDist * 1.2);
    // text('hello', thumb.x, thumb.y);

    if (fingOneDist < 70) {
      history.push({
        circleX,
        circleY,
        radius: fingOneDist / 2,
        color: colorchange,
      });
    }
  }
  for (let i = 0; i < history.length; i++) {
    fill(history[i].color);
    ellipse(history[i].circleX, history[i].circleY, history[i].radius);
  }
}
