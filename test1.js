/*
	Function  :color game
	Author    :醋姑娘
 */

//1. 公共变量声明块........................................................

var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d");

var Rcode = new Image();
Rcode.src = "Rcode.png";

var circle = new Image();
circle.src = "circle.png";

var TIME  = 15;

var NOW = TIME;

const BIGRECT_WIDTH = 700,
	  BIGRECT_HEIGHT = 700;

var bigRect = {
	x: canvas.width / 2 - BIGRECT_WIDTH / 2,
	y: canvas.height / 2 - BIGRECT_HEIGHT / 1.3,
	w: BIGRECT_WIDTH,
	h: BIGRECT_HEIGHT
};

var MARGIN = 5,
	STEP = 80;

var rightDIRECTION = {
	x1: 0,
	y1: 0,
	x2: 0,
	y2: 0
};
var countDown = {
	x:canvas.width/5,
	y:canvas.height/1.7
};
var text = {
	textc: "Game over!",
	x: canvas.width / 2,
	y: canvas.height / 2
};
var iBlock = 2;

//2. 函数定义块...........................................................
function addName() {
	ctx.save();
	ctx.font = "50px fantasy,arial";
	ctx.fillText("code by 醋姑娘",canvas.width*0.6,canvas.height*19/20);
	ctx.drawImage(Rcode,canvas.width/5,canvas.height*9/10,100,100);
	ctx.restore();
}
function Coordinate(canvas,point) {
	//坐标转换
	var box = canvas.getBoundingClientRect();
	var canvasStyle = window.getComputedStyle(canvas);

	point.x -= box.left;
	point.y -= box.top;
	
	point.x -= parseFloat(canvasStyle["borderLeft"]);
	point.y -= parseFloat(canvasStyle["borderTop"]);

	point.x -= parseFloat(canvasStyle["padding-left"]);
	point.y -= parseFloat(canvasStyle["padding-top"]);
	
	var xRatio = canvas.width/parseFloat(canvasStyle["width"]);
	var yRatio = canvas.height/parseFloat(canvasStyle["height"]);

	point.x *= xRatio;
	point.y *= yRatio;
	
	return point;
}

function drawG() {
	ctx.save();
	ctx.font = "150px arial";
	ctx.fillText("第 "+ (iBlock-1) + " 关",canvas.width/2,canvas.height/10);
	// ctx.fillText("第",MARGIN*15,MARGIN*50);
	// ctx.fillText((iBlock-1),MARGIN*15,MARGIN*70);
	// ctx.fillText("关",MARGIN*15,MARGIN*90);
	ctx.restore();
}
// function drawClock(){
// 	ctx.drawImage(circle,countDown.x,countDown.y);
// }
function draw_Rect(step, n) {
	
	addName();
	var h = parseInt(Math.random() * 360);
	var l = 75+Math.random()*20,
		s = 100;

	var basicColor = "hsl(" + h + "," + s + "%," + l + "%)";
	// var difColor = "hsl(" + h + "," + (s - step) + "%," + l + "%)";
	var difColor = "hsl(" + (h - 15 + Math.random()*15) + "," + (s - 10 - Math.random()*(step-10)) + "%," + l + "%)";

	var side = (BIGRECT_WIDTH - (n + 1) * MARGIN) / n;
	var ci = parseInt(Math.random() * n),
		cj = parseInt(Math.random() * n);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = basicColor;
	ctx.lineWidth = 4;
	addName();
	drawG();
	ctx.strokeRect(bigRect.x, bigRect.y, bigRect.w, bigRect.h);

	for (i = 0; i < n; i++) {
		for (j = 0; j < n; j++) {
			if (i == ci && j == cj) {
				//随机生成游戏出口的位置
				//alert("第"+(cj+1)+"行，"+"第"+(ci+1)+"列");
				ctx.fillStyle = difColor;
				rightDIRECTION.x1 = bigRect.x + side * i + MARGIN * (i + 1);
				rightDIRECTION.x2 = rightDIRECTION.x1 + side;
				rightDIRECTION.y1 = bigRect.y + side * j + MARGIN * (j + 1);
				rightDIRECTION.y2 = rightDIRECTION.y1 + side;
			} else {
				ctx.fillStyle = basicColor;
			}
			ctx.fillRect(bigRect.x + side * i + MARGIN * (i + 1), bigRect.y + side * j + MARGIN * (j + 1), side, side);

		}
	}

	NOW = TIME;
	ctx.font = "150px arial";
	// ctx.arc(canvas.width/2, canvas.height/1.35, 120, 0, Math.PI*2);
	// ctx.stroke();
	ctx.fillText(NOW, canvas.width/2, canvas.height/1.3);
	drawG();
	//30s没有找出答案就结束游戏 呈现一个倒计时的效果
	ID = setInterval(function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		addName();
		ctx.strokeRect(bigRect.x, bigRect.y, bigRect.w, bigRect.h);
		// ctx.arc(canvas.width/2, canvas.height/1.35, 120, 0, Math.PI*2);
		// ctx.stroke();
		ctx.fillText(--NOW, canvas.width/2, canvas.height/1.3);
		drawG();
		for (i = 0; i < n; i++) {
			for (j = 0; j < n; j++) {
				if (i == ci && j == cj) {
					ctx.fillStyle = difColor;
				} else {
					ctx.fillStyle = basicColor;
				}
				ctx.fillRect(bigRect.x + side * i + MARGIN * (i + 1), bigRect.y + side * j + MARGIN * (j + 1), side, side);

			}
		}

		if (NOW == 0) {
			canvas.removeEventListener("Click", onCanvasClick);
			gameover();
		}

	}, 1000);

}

function gameover() {
	ctx.save();
	ctx.font = "130px fantasy";
	ctx.fillStyle = "black";
	ctx.fillText(text.textc, text.x, text.y);
	ctx.restore();
	clearInterval(ID);

}
//3. 事件注册块...........................................................
function onRestart(){
	clearInterval(ID);
	iBlock = 2;
	canvas.addEventListener("Click", onCanvasClick);
	draw_Rect(STEP, iBlock);
}
function onCanvasClick(event) {
	var now = {x : event.clientX,
		y : event.clientY};
		now = Coordinate(canvas, now);

		if (now.x >= rightDIRECTION.x1 && now.x <= rightDIRECTION.x2 && now.y >= rightDIRECTION.y1 && now.y <= rightDIRECTION.y2) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		clearInterval(ID);
		draw_Rect(STEP - iBlock, ++iBlock);
		
	}
}

function change() {
	clearInterval(ID);
	draw_Rect(STEP - iBlock, iBlock);
}

canvas.addEventListener("click", onCanvasClick);
//4. 初始化块............................................................
Rcode.onload = function(){
	ctx.textbaseline = "middle";
	ctx.textAlign = "center";
	draw_Rect(STEP, iBlock);//第一关是2*2的小方块
}
