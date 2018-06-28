//load canvas
var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
var state = false;
var starts = false;
var gameoverBool = false;
var pipeDeletingNum = 0;
var pipeNum = 0;
var pipeLeft = 0;
var flyCount = 700;
var score = 0;
var birdMove = 0;
var deathPross = true
var death = 0;


	//momery allocation for images
	var bg = new Image();
	var birdWingStright = new Image();
	var birdWingUp = new Image();
	var birdWingDown = new Image();
	var fg = new Image();
	var startButton = new Image();
	var title = new Image();
	var deadBird = new Image();
	var deadBirdRotated = new Image();
	var pipeNorth = new Image();
	var pipeSouth = new Image();
	var gameover = new Image();
	var replay = new Image();

	var dieSound;
	dieSound = new Audio("sounds/die.mp3");
	var scoreSound;
	scoreSound = new Audio("sounds/score.mp3");
	var flySound;
	flySound = new Audio("sounds/fly.mp3");
	var platformerSounds;
	platformerSounds = new Audio("sounds/platformer.mp3");

	//assign images
	replayObj = { x : 30, y : 250, h : 235, w : 95};
	replay.src = "images/replay.png"

	bgObj = { x : 0, y : 0, h : 288, w : 512};
	bg.src = "images/bg.png"

	gameoverObj = { x : 0, y : 0, h : 424, w : 91};
	gameover.src = "images/gameover.png"

	birdObj = { x : 125, y : 220, h : 38, w : 26};
	deadBird.src = "images/birdDead.png"
	deadBirdRotated.src = "images/rotatedBirdDead.png"
	birdWingStright.src = "images/birdWingStright.png"
	birdWingUp.src = "images/birdWingUp.png"
	birdWingDown.src = "images/birdWingDown.png"

	fgObj = { x : 0, y : 397, h : 306, w : 118};
	fg.src = "images/fg.png"

	startButtonObj = { x : 45, y : 297, h : 200, w : 110};
	startButton.src = "images/startButtton.png"

	titleObj = { x : 20, y : 50, h : 250, w : 100};
	title.src = "images/FlappyBirdTitle.png"

	pipeObj = []; 
	pipeObj[0] = { x : 288, y : -50};
	gamePipeObj = [];
	gamePipeObj[0] = { x : 288, y : 0};
	pipeNorth.src = "images/pipeNorth.png"
	pipeSouth.src = "images/pipeSouth.png"

startGame();

function startGame() {
	platformerSounds.volume = 0.1;
	flySound.volume = 1.0;
	flySound.volume = 1.0;
	platformerSounds.play();
	//Draw the starts
	DrawStart();
	window.addEventListener("keydown", checkSpace, false);
}


function checkSpace(key) {
	if(key.keyCode == "32"){
		titleObj.h = 0;
		titleObj.w = 0;
		startButtonObj.h = 0;
		startButtonObj.w = 0;
		state = true;
		starts = true;
		window.removeEventListener("keydown", checkSpace, false);
	}
}
function DrawStart() {
	if(gameoverBool == false){
		birdMove++;
		window.addEventListener("keydown", jumb, false);
		window.removeEventListener("keydown", isStart, false);
		//draw start images
		ctx.drawImage(bg, bgObj.x, bgObj.y, bgObj.h, bgObj.w);
		flyCount++;
		if(flyCount % 100 == 0){
			console.log(flyCount)
			if( ((flyCount/100) % 2) === 0){
				birdObj.y += 5;
			}
			else{
				birdObj.y -= 5;
			}
			if(flyCount >= 1100){
				flyCount = 700;
			}
		}
		//pipes moving for start
		if(state == false){
			for (var i = 0; i < pipeObj.length; i++){
				ctx.drawImage(pipeNorth, pipeObj[i].x, pipeObj[i].y);
				ctx.drawImage(pipeSouth, pipeObj[i].x, pipeObj[i].y + 310);
				pipeObj[i].x--;

				if(pipeObj[i].x == 125){
					pipeObj.push({
						x: 288,
						y: -50,
					});
					pipeNum++;
					console.log("new pipe");
					console.log(pipeNum);
					if(starts == true){
						break;
					}
				}
			}   
		}

		if(starts == true){
			for (var i = 0; i < pipeObj.length; i++){
				console.log("delete");
				pipeObj[i].x = -288;

				pipeDeletingNum++;
				if(pipeDeletingNum > pipeNum){
					starts = false;
					break;
				}
			}   
		}   

		if(state === true){

			birdObj.y += 1.4;

			if(birdObj.x > 50){
				birdObj.x--;
			}

			//checkGroundHit
			if(birdObj.y > 371) {
				gameoverBool = true;
				death = 1;
				dieSound.play();
				dead();
			}

			for (var i = 0; i < gamePipeObj.length; i++){
				ctx.drawImage(pipeNorth, gamePipeObj[i].x, gamePipeObj[i].y);
				ctx.drawImage(pipeSouth, gamePipeObj[i].x, gamePipeObj[i].y + 310);
				gamePipeObj[i].x--;

				if(gamePipeObj[i].x == 125){
					pipeLeft++;
					console.log("pipes for game");
					gamePipeObj.push({
						x: 288,
						y: Math.floor(Math.random()*150)-150,
					});
				}

				if(gamePipeObj[i].x == 83){
					if((gamePipeObj[i].y + 242) > birdObj.y || (gamePipeObj[i].y + 310) < (birdObj.y + birdObj.h)){
						dieSound.play();
						gameoverBool = true;
						death = 2;
						dead();
					}
				}
				if((gamePipeObj[i].x < 83) && ((gamePipeObj[i].x + 52) > 83)) {
					if((gamePipeObj[i].y + 242) > birdObj.y || (gamePipeObj[i].y + 322) < (birdObj.y + birdObj.h)){
						dieSound.play();
						gameoverBool = true;
						death = 2;
						dead();
					}
				}
				if((gamePipeObj[i].x + 52) == 83){
					score++;
					scoreSound.play();
				}
				if(gamePipeObj[i].x < 31){
					ctx.textAlign="center"; 
					ctx.font="200px Cooper";
					ctx.strokeStyle = 'black';
					ctx.fillStyle = "#70B92D";
					if(score > 99){
						ctx.font="150px Cooper";
					}
					if(score > 999){
						ctx.font="100px Cooper";
					}
					ctx.lineWidth = 8;
					ctx.strokeText(score,144,156);
					ctx.fillText(score,144,156);
				}
			}
		}
		if(birdMove <= 15){
			ctx.drawImage(birdWingUp, birdObj.x, birdObj.y, birdObj.h, birdObj.w);
		}
		else if(birdMove <= 30){
			ctx.drawImage(birdWingStright, birdObj.x, birdObj.y, birdObj.h, birdObj.w);
		}
		else if(birdMove <= 45){
			ctx.drawImage(birdWingDown, birdObj.x, birdObj.y, birdObj.h, birdObj.w);
		}
		else if(birdMove <= 60){
			ctx.drawImage(birdWingStright, birdObj.x, birdObj.y, birdObj.h, birdObj.w);
		}
		else if(birdMove <= 75){
			ctx.drawImage(birdWingUp, birdObj.x, birdObj.y, birdObj.h, birdObj.w);
			if(birdMove <= 76){
				birdMove = 0;
			}
		}
		ctx.drawImage(fg, fgObj.x, fgObj.y, fgObj.h, fgObj.w);
		ctx.drawImage(startButton, startButtonObj.x, startButtonObj.y, startButtonObj.h, startButtonObj.w);
		ctx.drawImage(title, titleObj.x, titleObj.y, titleObj.h, titleObj.w);
	
	requestAnimationFrame(DrawStart);
	}
}

function jumb(key) {
	if(key.keyCode == "32"){
		if(birdObj.y > 5){
			birdObj.y -= 27;
		}
	flySound.play();
	}
}

function dead() {
	if(gameoverBool == true){
		window.removeEventListener("keydown", jumb, false);
		window.addEventListener("keydown", isStart, false);
		ctx.drawImage(bg, bgObj.x, bgObj.y, bgObj.h, bgObj.w);
		ctx.drawImage(pipeNorth, gamePipeObj[pipeLeft].x, gamePipeObj[pipeLeft].y);
		ctx.drawImage(pipeSouth, gamePipeObj[pipeLeft].x, gamePipeObj[pipeLeft].y + 310);
		if(pipeLeft >= 1){
			ctx.drawImage(pipeNorth, gamePipeObj[pipeLeft -1].x, gamePipeObj[pipeLeft -1].y);
			ctx.drawImage(pipeSouth, gamePipeObj[pipeLeft -1].x, gamePipeObj[pipeLeft -1].y + 310);
		}
		ctx.textAlign="center"
		ctx.font="200px Cooper"; 
		ctx.strokeStyle = 'black';
		ctx.fillStyle = "#70B92D";
		if(score > 99){
			ctx.font="150px Cooper";
		}
		if(score > 999){
			ctx.font="100px Cooper";
		}
		ctx.strokeText(score,144,156);
		ctx.lineWidth = 8;
		ctx.fillText(score,144,156);
		ctx.drawImage(fg, fgObj.x, fgObj.y, fgObj.h, fgObj.w);
		ctx.drawImage(replay, replayObj.x, replayObj.y, replayObj.h, replayObj.w);
		ctx.drawImage(startButton, startButtonObj.x, startButtonObj.y, startButtonObj.h, startButtonObj.w);
		ctx.drawImage(title, titleObj.x, titleObj.y, titleObj.h, titleObj.w);

		if(death == 1){ //death by ground
			console.log("ground")
			ctx.drawImage(deadBird, birdObj.x, birdObj.y, birdObj.h, birdObj.w);
			birdObj.w = 0;
			birdObj.h = 0;
			ctx.drawImage(birdWingUp, birdObj.x, birdObj.y, birdObj.h, birdObj.w);
			ctx.drawImage(birdWingStright, birdObj.x, birdObj.y, birdObj.h, birdObj.w);
			ctx.drawImage(birdWingDown, birdObj.x, birdObj.y, birdObj.h, birdObj.w);
			birdObj.w = 26;
			birdObj.h = 38;
		}
		else if(death == 2){ //death by pipe
			console.log("pipe")
			ctx.drawImage(deadBirdRotated, birdObj.x, birdObj.y, birdObj.h, birdObj.w);
			birdObj.w = 0;
			birdObj.h = 0;
			ctx.drawImage(birdWingUp, birdObj.x, birdObj.y, birdObj.h, birdObj.w);
			ctx.drawImage(birdWingStright, birdObj.x, birdObj.y, birdObj.h, birdObj.w);
			ctx.drawImage(birdWingDown, birdObj.x, birdObj.y, birdObj.h, birdObj.w);
			birdObj.w = 38;
			birdObj.h = 26;
		}
		if(birdObj.y < 360){
			birdObj.y += 3;
		}
		requestAnimationFrame(dead);
	}
}

function isStart(key) {
	if(key.keyCode == "32"){
		replayObj = { x : 30, y : 250, h : 235, w : 95};
		bgObj = { x : 0, y : 0, h : 288, w : 512};
		gameoverObj = { x : 0, y : 0, h : 424, w : 91};
		birdObj = { x : 125, y : 220, h : 38, w : 26};
		fgObj = { x : 0, y : 397, h : 306, w : 118};
		startButtonObj = { x : 45, y : 297, h : 200, w : 110};
		titleObj = { x : 20, y : 50, h : 250, w : 100};
		pipeObj = []; 
		pipeObj[0] = { x : 288, y : -50};
		gamePipeObj = [];
		gamePipeObj[0] = { x : 288, y : 0};
		state = false;
		starts = false;
		gameoverBool = false;
		pipeDeletingNum = 0;
		pipeNum = 0;
		pipeLeft = 0;
		flyCount = 700;
		score = 0;
		death = 0;
		startGame();
	}
}