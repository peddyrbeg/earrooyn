let x;
let aBee;

let gameStart;
let gameSet = false;
let gameEnded = false;
let startBut;
let sq = [];
let sqNo = 0;
let gridPosX;
let gridPosY;
let ranSq;
let ranSqs = [];
let finished = false;
let promptY;

let score = 0;
let points = false;
let pAlph = 255;
let streak = 0;
let t = 0;
let tBon = 6;
let tSize = 20;
let bonAd = 0;
let tBonY = 0;
let tBonTx = 30;
let bonAnim = false;
let scAnim = 0;

let num = ["neunhee", "nane", "jees", "tree", "kiare", "queig", "shey", "shiaght", "hoght", "nuy", "jeih",
          "nane-jeig", "daa-yeig"];
let ranNum;
let range1;
let range2;
let lower;
let upper;

let corr = false;
let incorr = false;
let count = 0;
let countInc = [];
let butDis = false;

let actBut;
let actDis;

let size;
let sizeW;
let sizeH;
  
let pos;
let posX;
let posY;

let c1; //orange
let c2; //blue
let c3; //green

function preload () {
  aBee = loadFont("ABeeZee-Regular.ttf");
}

function setup() {
  
  if (displayWidth <= 600) cnv = createCanvas(displayWidth, displayHeight);
  else cnv = createCanvas(320, displayHeight-(displayHeight*0.151));
  x = (displayWidth - width) / 2;
  cnv.position(x);

  textFont(aBee);
  
  gridPosX = (displayWidth-300)/2;
  gridPosY = 250;
  promptY = gridPosY - 50;

  for (let n = 13; n < 101; n++) {
    if (n > 12 && n < 20) num.push(num[n-10] + "-jeig");
    if (n == 20) num.push("feed");
    if (n > 20 && n < 40) num.push(num[n-20] + " as feed");
    if (n == 40) num.push("daeed");
    if (n > 40 && n < 60) num.push(num[n-40] + " as daeed");
    if (n == 60) num.push("tree feed");
    if (n > 60 && n < 80) num.push("tree feed as " + num[n-60]);
    if (n == 80) num.push("kiare feed");
    if (n > 80 && n < 100) num.push("kiare feed as " + num[n-80]);
    if (n == 100) num.push("un cheead");
  }

  c1 = color(230, 102, 13);
  c2 = color(25, 153, 242);
  c3 = color(94, 153, 24);

  range1 = createSlider(1, 101, 0, 10);
  range1.position(displayWidth/2-67.5, 215);
  range1.style("background-color", c1)

  range2 = createSlider(1, 101, 10, 10);
  range2.position(displayWidth/2-67.5, 365);

  startBut = createButton("START");
  startBut.size(100, 50);
  startBut.position(displayWidth/2-50, 500);
  startBut.style("border", "none");
  startBut.style("background", c2);
  startBut.style("color", "white");
  startBut.style("font-size", "20px");
  startBut.mousePressed(startGame);
  
}

function draw() {
  
  background(255);

  if (!gameStart) {
    if (range1.elt.value > range2.elt.value - 10) range1.elt.value = range2.elt.value - 10;
    if (range2.elt.value < 10) range2.elt.value = 11;
    lower = range1.elt.value;
    upper = range2.elt.value - 1;

    textAlign(CENTER);
    textSize(20);

    fill(0);
    text("Choose your number range:", cnv.width/2, 100);

    noStroke();
    fill(c1);
    rectMode(CENTER);
    rect(cnv.width/2, 225, 200, 100, 20);
    rect(cnv.width/2, 375, 200, 100, 20);

    fill(255);
    text("from", cnv.width/2, 207);
    text(lower, cnv.width/2, 255);
    text("to", cnv.width/2, 357);
    text(upper, cnv.width/2, 405);
  }

  else {

    if (!gameSet) setGame();

    textAlign(CENTER);

    textSize(32);
    
    fill(200);
    ellipse(width/2, 75, 100, 100);
    
    t % 60 == 0 ? stroke(255, 0, 0) : noStroke();
    t % 60 == 0 ? fill(255, 0, 0) : fill(94+t, 153-t*2.55, 24-t*0.4);
    arc(width/2, 75, 100, 100, -1.5708, t*0.017453*6-1.5708);
    t % 60 == 0 ? fill(255, 0, 0) : fill(255);
    ellipse(width/2, 75, 70, 70);
    t % 60 == 0 ? fill(255) : fill(0);
    text(t, width/2, 86);
    
    if(finished) {
      if (bonAd != score || bonAnim) { // check for bonus to add or if animation already initiated
        bonAnim = true; // animation initiated
        let bonDist = 625 - 275; // distance to move between score and bonus msg
        if (tBonY < bonDist - 100) tBonY += 6; // move bonus text (-100 to adjust for size of text)
        textSize(tBonTx);
        if (tBonTx > 0) { // set text size animation limit
          if (tBonY > 120) tBonTx -= 2.78; // wait to shrink text after it has moved 120 pixels
          text("Time Bonus", width/2, 275 + tBonY);
          text("x" + floor(tBon), width/2, 305 + tBonY);
        }
        if (score < bonAd) { // add bonus to score
          score++;
          scAnim++; // animate score size
        }
        else if (score == bonAd && tBonY >= bonDist - 100) { // all animations complete
          scAnim = 0;
          textSize(30);
          if (score >= 45) text("Jeant dy mie!", width/2, 275);
          else text("Prow reesht!", width/2, 275);
          if (!gameEnded) gameEnd();
        }
      }
      else if (bonAd == score && !bonAnim) {
          scAnim = 0;
          text("Prow reesht!", width/2, 275);
          if (!gameEnded) gameEnd();
      }
    }
    else {
      if (ranNum % 2 == 0) fill(c2);
      else fill(c1);
      if (points) {
        stroke(94, 153, 24, pAlph);
        strokeWeight(2);
      }
      else noStroke();
      rectMode(CENTER);
      textSize(25);
      let numW = textWidth(num[ranNum]);
      rect(width/2, promptY-7.5, numW + 50, 60);
      fill(255);
      text(num[ranNum], width/2, promptY);
      t = floor(frameCount/60);
      fill(0);
      if (tBon > 1) tBon -= 1/600;
    }
    
    if (points) {
      pAlph -= 5;
      fill(0, 0, 0, pAlph);
      stroke(0, 0, 0, pAlph);
      noStroke();
      tSize+=0.2;
      textSize(tSize - 10);
      text("+" + streak, posX+50, posY+60);
      stroke(94, 153, 24, pAlph);
      textSize(tSize);
      fill(94, 153, 24, pAlph);
      if (streak > 1) text(streak + "x streak!", posX+50, posY+30);
      if (pAlph <= 0) points = false;
    }
    else {
      pAlph = 255;
      tSize = 20;
    }
    
    noFill();
    stroke(0);
    strokeWeight(1.5);
    ellipse(width/2, 613, 75 + scAnim, 50+scAnim);
    noStroke();
    textSize(32 + scAnim);
    if (score < 0) fill(255, 0, 0);
    else fill(0);
    text(floor(score), width/2, 625 + scAnim/2);
    
    if (corr) sqAnim();
    if (incorr) incorrect();
  }
  
}

function startGame () {

  gameStart = true;
  frameCount = 0;

}

function setGame () {

  gameSet = true;

  startBut.style("display", "none");
  range1.style("display", "none");
  range2.style("display", "none");

  for (let c = 0; c < upper; c++) {
    countInc.push(0);
  }

  for (let i = 0; ranSqs.length < 9; i++) {
    ranSq = floor(random(parseInt(lower), parseInt(upper+1)));
    if (ranSqs.indexOf(ranSq) == -1) {
      ranSqs.push(ranSq);
    }
  }

  selectNum();
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      sq[sqNo] = createButton(ranSqs[sqNo] + "");
      sq[sqNo].id(ranSqs[sqNo]);
      sq[sqNo].position((i*100)+gridPosX, (j*100)+gridPosY);
      sq[sqNo].size(100, 100);
      if (ranSqs[sqNo] % 2 == 0) {
        sq[sqNo].style("background", c2);
        sq[sqNo].style("color", "white");
      }
      if (ranSqs[sqNo] % 2 != 0) {
        sq[sqNo].style("background", c1);
        sq[sqNo].style("color", "white");
      }
      sq[sqNo].style("border-color", "white");
      sq[sqNo].style("font-size", "32px");
      sq[sqNo].mousePressed(checkAns);
      sqNo++;
    }
  }

}

function selectNum () {
  
    ranNum = ranSqs[floor(random(ranSqs.length))];
  
}

function checkAns () {
  if (this.id() == ranNum) {
    ranSqs.splice(ranSqs.indexOf(parseInt(this.id())), 1);
    corr = true;
  }
  else incorr = true;
  actBut = this;
  size = this.size();
  sizeW = size.width;
  sizeH = size.height;

  pos = this.position();
  posX = pos.x - x;
  posY = pos.y;
}

function incorrect () {
  
  if (countInc[actBut.id()] > 20) {
    score--;
    streak = 0;
    incorr = false;
    countInc[actBut.id()] = 0;
    actBut.size(100, 100);
    actBut.position(pos.x, pos.y);
    actBut.style("font-size", "32px");
    actBut.style("border-color", "white");
    actBut.style("background", "grey");
    actBut.style("color", "black");
    actBut.style("z-index", "0");
  }
  else {
    actBut.style("pointer-events", "none");
    actBut.style("z-index", "1");
    countInc[actBut.id()] += 2;
    actBut.size(sizeW + countInc[actBut.id()], sizeH + countInc[actBut.id()]);
    actBut.position(pos.x - countInc[actBut.id()]/2, pos.y - countInc[actBut.id()]/2);
    actBut.style("font-size", 32 + countInc[actBut.id()] + "px");
    actBut.style("border-color", "red");
    actBut.style("color", "red");
  }
  
}

function disableButtons () {
  butDis = true;
  sq.forEach(e => e.style("pointer-events", "none"));
}

function sqAnim () {
  
  if (!butDis) disableButtons(); //prevent clicking of other buttons during anim

  if (count > 80) {
    streak++;
    score += 1 * streak;
    points = true;
    corr = false;
    butDis=false;
    count = 0;
    actBut.remove();
    if (ranSqs.length == 0) {
      if (!finished) {
        bonAd = score + floor(tBon) * 2;
        finished = true;
      }
    }
    selectNum();
    for (let i = 0; i < sq.length; i++) {
      if (parseInt(sq[i].id()) % 2 == 0) sq[i].style("background", c2);
      else sq[i].style("background", c1);
      sq[i].style("color", "white");
      sq[i].style("pointer-events", "auto");
    }
  }
  else if (count >= 20 && count <= 80) {
    count+= 4;
    actBut.size(sizeW - count, sizeH - count);
    actBut.position(pos.x + count/2, pos.y + count/2);
    actBut.style("font-size", (32/(count/20 + 1)) + "px");
    actBut.style("background", "white");
    actBut.style("border-color", "green");
    actBut.style("color", "green");
  }
  else if (count >= 0 && count < 20) {
    count += 2;
    actBut.style("pointer-events", "none");
    actBut.size(sizeW + count, sizeH + count);
    actBut.position(pos.x - count/2, pos.y - count/2);
    actBut.style("font-size", 32 + count + "px");
    actBut.style("background", "white");
    actBut.style("border-color", "green");
    actBut.style("color", "green");
    actBut.style("z-index", "1");
  }
  
}

function gameEnd () {

  gameEnded = true;

  let home = createButton("RETRY");
  home.size(100, 50);
  home.position(displayWidth/2-50, 375);
  home.style("border", "none");
  home.style("background", c2);
  home.style("color", "white");
  home.style("font-size", "20px");
  home.mousePressed(restart);

}

function restart () {

  location.reload();

}
