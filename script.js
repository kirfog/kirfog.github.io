let x = 20;
let y = 20;
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

rnd();

for (let i = 0; i < x; i++) {
	r = (i < 10) ? "0"+i : i;
	$('#live').append('<div class="row" id="row' + r + '"></div>');
	for (let j = 0; j < y; j++) {
		a = (i < 10) ? "0"+i : i;
		b = (j < 10) ? "0"+j : j;
		if (cells[i][j] == 0){
		dead = dead + 1;
		$('#row'+r).append('<div class="btn btn-outline-warning" id="cell' + a + b +'"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dice-1" viewBox="0 0 16 16"><circle cx="8" cy="8" r="1.5"/><path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z"/></svg></div>');
		} else {
		alive = alive + 1;
		$('#row'+r).append('<div class="btn btn-outline-success" id="cell' + a + b +'"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dice-1-fill" viewBox="0 0 16 16"><path d="M3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3zm5 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg></div>');
		}
		$('#cell'+a+b).click(function() {
 			clickon(i,j);
		});
}}


$('#cont').append('<div id="run" class="btn btn-outline-dark">START</div>');
$('#run').on('click',function(){
	timeint = setInterval("run();", 500);
});

$('#cont').append('<div id="clear" class="btn btn-outline-dark">CLEAR</div>');
$('#clear').on('click',function(){
	clearInterval(timeint);
	clear();
});

$('#cont').append('<div id="rnd" class="btn btn-outline-dark">RANDOM</div>');
$('#rnd').on('click',function(){
	clearInterval(timeint);
	rnd();
});

$('#cont').append('<div class="row" id="info"></div>');

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
		$('#info').replaceWith('<div class="row" id="info">GAME OVER on turn: '+ h + ' Dead: '+ dead +' Alive: '+ alive + '</div>');
		clearInterval(timeint);
	} else {
		$('#info').replaceWith('<div class="row" id="info">Turn: '+ h + ' Dead: '+ dead +' Alive: '+ alive + '</div>');
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

function drowcells(){
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
	$('#cell'+a+b).replaceWith('<div class="btn btn-outline-warning" id="cell' + a + b +'"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dice-1" viewBox="0 0 16 16"><circle cx="8" cy="8" r="1.5"/><path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z"/></svg></div>');
	$('#cell'+a+b).click(function() {
 		clickon(i,j);
	});
}

function born(i,j){
	a = (i < 10) ? "0"+i : i;
	b = (j < 10) ? "0"+j : j;
	$('#cell'+a+b).replaceWith('<div class="btn btn-outline-success" id="cell' + a + b +'"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dice-1-fill" viewBox="0 0 16 16"><path d="M3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3zm5 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg></div>');
	$('#cell'+a+b).click(function() {
 		clickon(i,j);
	});
}