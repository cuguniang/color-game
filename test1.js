/*
	Function  :color game
	Author    :醋姑娘
 */


//1. 公共变量声明块........................................................

var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d");
//倒计时30
var TIME  = 30;
var NOW = TIME;
const BIGRECT_WIDTH = 500,
	  BIGRECT_HEIGHT = 500;

var bigRect = {
	x: canvas.width / 2 - BIGRECT_WIDTH / 2,
	y: canvas.height / 2 - BIGRECT_HEIGHT / 2,
	w: BIGRECT_WIDTH,
	h: BIGRECT_HEIGHT
};
var MAGIN = 5,
	STEP = 80;

var rightDIRECTION = {
	x1: 0,
	y1: 0,
	x2: 0,
	y2: 0
};
var style = {
	font: "80px arial",
	textalign: "center",
	textbaseline: "middle",
	fillstyle: "black"
};
var text = {
	textc: "你还喜欢紫色吗!?",
	x: canvas.width / 2,
	y: canvas.height / 2
};
var iBlock = 2;

//2. 函数定义块...........................................................
function addName() {
	ctx.save();
	ctx.font = "20px 华文新魏";
	ctx.fillText("code by 醋姑娘",MAGIN*15,canvas.height - MAGIN*10);
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

	ctx.fillText("第",MAGIN*15,MAGIN*50);
	ctx.fillText((iBlock-1),MAGIN*15,MAGIN*70);
	ctx.fillText("关",MAGIN*15,MAGIN*90);
}
function draw_Rect(step, n) {
	
	addName();
	//250 - 280 main in purple
	var h = parseInt(Math.random() * 360);
	var l = 80,
		s = 100;
	var basicColor = "hsl(" + h + "," + s + "%," + l + "%)";
	var difColor = "hsl(" + h + "," + (s - step) + "%," + l + "%)";

	var side = (BIGRECT_WIDTH - (n + 1) * MAGIN) / n;
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
				rightDIRECTION.x1 = bigRect.x + side * i + MAGIN * (i + 1);
				rightDIRECTION.x2 = rightDIRECTION.x1 + side;
				rightDIRECTION.y1 = bigRect.y + side * j + MAGIN * (j + 1);
				rightDIRECTION.y2 = rightDIRECTION.y1 + side;
			} else {
				ctx.fillStyle = basicColor;
			}
			ctx.fillRect(bigRect.x + side * i + MAGIN * (i + 1), bigRect.y + side * j + MAGIN * (j + 1), side, side);

		}
	}

	NOW = TIME;
	ctx.arc(MAGIN*15, MAGIN*20, 70, 0, Math.PI*2);
	ctx.stroke();
	ctx.fillText(NOW, MAGIN * 15, MAGIN * 20);
	drawG();
	//30s没有找出答案就结束游戏 呈现一个倒计时的效果
	ID = setInterval(function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		addName();
		ctx.strokeRect(bigRect.x, bigRect.y, bigRect.w, bigRect.h);
		ctx.arc(MAGIN*15, MAGIN*20, 70, 0, Math.PI*2);
		ctx.stroke();
		ctx.fillText(--NOW, MAGIN * 15, MAGIN * 20);
		drawG();
		for (i = 0; i < n; i++) {
			for (j = 0; j < n; j++) {
				if (i == ci && j == cj) {
					ctx.fillStyle = difColor;
				} else {
					ctx.fillStyle = basicColor;
				}
				ctx.fillRect(bigRect.x + side * i + MAGIN * (i + 1), bigRect.y + side * j + MAGIN * (j + 1), side, side);

			}
		}

		if (NOW == 0) {
			gameover();
		}

	}, 1000);

}

function gameover() {
	//gameover后还能继续点方块 需改进
	//已改进！————停止倒计时，并移除鼠标点击事件的监听器
	ctx.fillStyle = "black";
	ctx.fillText(text.textc, text.x, text.y);
	clearInterval(ID);
	canvas.removeEventListener("Click", onCanvasClick);

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
ctx.textAlign = style.textalign;
ctx.textBaseline = style.textbaseline;
ctx.font = style.font;
draw_Rect(STEP, iBlock);//第一关是2*2的小方块
