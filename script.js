let x = 20;
let y = 30;
let n = 0;
let dead = 0;
let alive = 0;
let h = 0;
let timeint;

let cells = Array(x).fill(0).map(x => Array(y).fill(0));
let cellsP = Array(x).fill(1).map(x => Array(y).fill(1));
let cellsN = Array(x).fill(0).map(x => Array(y).fill(0));
let cellsA = Array(x+2).fill(0).map(x => Array(y+2).fill(0));
let cellsB = Array(x+2).fill(0).map(x => Array(y+2).fill(0));

let alivesvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/></svg>'
let deadsvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sign-dead-end-fill" viewBox="0 0 16 16"><path d="M5.116 6.28h.32c.395 0 .582.24.582.722 0 .48-.186.718-.581.718h-.321V6.28Zm3.636.066.268.845h-.552l.27-.845h.014Zm1.327-.066h.32c.394 0 .582.24.582.722 0 .48-.186.718-.582.718h-.32V6.28Zm-.792 3h.32c.395 0 .582.24.582.722 0 .48-.186.718-.581.718h-.32V9.28Z"/><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098L9.05.435ZM4.782 6h.69c.596 0 .886.355.886.998S6.066 8 5.473 8h-.69V6ZM7.82 7.72V8H6.571V6H7.82v.28h-.917v.57h.863v.268h-.863v.602h.917Zm.397.28h-.34l.688-2h.371l.689 2h-.352l-.177-.554h-.702L8.216 8Zm1.53-2h.69c.596 0 .886.355.886.998S11.03 8 10.436 8h-.69V6Zm-2.923 4.72V11H5.575V9h1.248v.28h-.917v.57h.863v.268h-.863v.602h.917Zm.572.28h-.32V9h.294l.933 1.436h.014V9h.32v2h-.292l-.936-1.44h-.013V11Zm1.56-2h.69c.596 0 .886.355.886.998S10.238 11 9.645 11h-.69V9Z"/></svg>'

rnd();
for (let i = 0; i < x; i++) {
	r = (i < 10) ? "0"+i : i;
	$('#live').append('<div id="row' + r + '"></div>');
	for (let j = 0; j < y; j++) {
		a = (i < 10) ? "0"+i : i;
		b = (j < 10) ? "0"+j : j;
		if (cells[i][j] == 0){
		dead = dead + 1;
		$('#row'+r).append('<div class="col btn btn-outline-warning" id="cell' + a + b +'">' + deadsvg + '</div>');
		} else {
		alive = alive + 1;
		$('#row'+r).append('<div class="col btn btn-outline-success" id="cell' + a + b +'">' + alivesvg + '</div>');
		}
		$('#cell'+a+b).click(function() {
 			clickon(i,j);
		});
}}

$('#cont').append('<div id="run" class="btn btn-outline-warning">START</div>');
$('#run').on('click',function(){
	timeint = setInterval("run();", 500);
});

$('#cont').append('<div id="clear" class="btn btn-outline-warning">CLEAR</div>');
$('#clear').on('click',function(){
	clearInterval(timeint);
	clear();
});

$('#cont').append('<div id="rnd" class="btn btn-outline-warning">RANDOM</div>');
$('#rnd').on('click',function(){
	clearInterval(timeint);
	rnd();
});

$('#cont').append('<div class="btn btn-outline-warning" id="info"></div>');

drowinfo();

function rnd(){
for (let i = 0; i < x; i++) {
	for (let j = 0; j < y; j++) {
		cells[i][j] = randomInteger(0, 1);
	}}
	h = 0;
	dead = 0;
	alive = 0;
	drowcells();
	drowinfo();
}

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function drowinfo(){
	if (ca(cellsP, cellsN)) {
		$('#info').replaceWith('<div class="btn btn-outline-warning" id="info">GAME OVER on turn: '+ h + ' Dead: '+ dead +' Alive: '+ alive + '</div>');
		clearInterval(timeint);
	} else {
		$('#info').replaceWith('<div class="btn btn-outline-warning" id="info">Turn: '+ h + ' Dead: '+ dead +' Alive: '+ alive + '</div>');
	}
}

function clear(){
	for (let i = 0; i < x; i++) {
		for (let j = 0; j < y; j++) {
			cells[i][j] = 0;
	}}
	h = 0;
	dead = 0;
	alive = 0;
	drowcells();
	drowinfo();
}

function run(){
	turn();
	drowcells();
	drowinfo();
}

function turn() {
	h = h + 1;
	dead = 0;
	alive = 0;
	for (let i = 0; i < x; i++) {
		for (let j = 0; j < y; j++) {
			cellsA[i+1][j+1] = cells[i][j];
			if (h % 2 != 0){
				cellsP[i][j] = cells[i][j];
			}
		}	
	}
	for (let i = 1; i < x+1; i++) {
		for (let j = 1; j < y+1; j++) {
			n = neib(cellsA,i,j);
			if (cellsA[i][j] == 0 & n == 3){
				cellsB[i][j] = 1;
			} else if (cellsA[i][j] == 1 & n > 3){
				cellsB[i][j] = 0;
			} else if (cellsA[i][j] == 1 & n < 2){
				cellsB[i][j] = 0;
			} else {
				cellsB[i][j] = cellsA[i][j];
			}
		}	
	}
	for (let i = 0 ; i < x; i++) {
		for (let j = 0; j < y; j++) {
                cellsN[i][j] = cellsB[i+1][j+1];
	}}

	cells = cellsN;
}

function neib(cellsarr,i,j){
	n = 0;
	for (let ni = i-1; ni < i+2; ni++) {
		for (let nj = j-1; nj < j+2; nj++) {
			if (ni == i && nj == j) {
			} else {
				n = n + cellsarr[ni][nj];
			}
		}
	}
	return n;
}

function ca(a, b) {
	for (let i = 0; i < x; i++) {
		for (let j = 0; j < y; j++) {
        	if (a[i][j] !== b[i][j]) return false;
    }}
    return true;
}

function drowcells(deadsvg, alivesvg){
	for (let i = 0; i < x; i++) {
		for (let j = 0; j < y; j++) {
			if (cells[i][j] == 0){
				dead = dead + 1;
				died(i,j);
			} else {
				alive = alive + 1;
				born(i,j);
			}
	}}
}

function clickon(i,j){
	if (cells[i][j] == 1){
		dead = dead + 1;
		cells[i][j] = 0;
		died(i,j);
	} else {
		alive = alive + 1;
		cells[i][j] = 1;
		born(i,j);
	}
	dead = 0;
	alive = 0;
	drowcells();
	drowinfo();
}

function died(i,j){
	a = (i < 10) ? "0"+i : i;
	b = (j < 10) ? "0"+j : j;
	$('#cell'+a+b).replaceWith('<div class="btn btn-outline-warning" id="cell' + a + b +'">' + deadsvg + '</div>');
	$('#cell'+a+b).click(function() {
 		clickon(i,j);
	});
}

function born(i,j){
	a = (i < 10) ? "0"+i : i;
	b = (j < 10) ? "0"+j : j;
	$('#cell'+a+b).replaceWith('<div class="btn btn-outline-success" id="cell' + a + b +'">' + alivesvg + '</div>');
	$('#cell'+a+b).click(function() {
 		clickon(i,j);
	});
}