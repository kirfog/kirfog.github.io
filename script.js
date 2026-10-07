function initGame() {
  const liveContainer = document.getElementById("live");
  const contContainer = document.getElementById("cont");

  if (!liveContainer || !contContainer) return;

  liveContainer.className = "";
  liveContainer.style.display = "flex";
  liveContainer.style.flexDirection = "column";
  liveContainer.style.gap = "4px";
  liveContainer.style.marginBottom = "20px";

  contContainer.className = "";
  contContainer.style.display = "flex";
  contContainer.style.flexWrap = "wrap";
  contContainer.style.gap = "8px";

  let x = 50;
  let y = 80;
  let n = 0;
  let dead = 0;
  let alive = 0;
  let h = 0;
  let timeint = null;

  let cells = Array(x)
    .fill(0)
    .map(() => Array(y).fill(0));
  let cellsP = Array(x)
    .fill(1)
    .map(() => Array(y).fill(1));
  let cellsN = Array(x)
    .fill(0)
    .map(() => Array(y).fill(0));
  let cellsA = Array(x + 2)
    .fill(0)
    .map(() => Array(y + 2).fill(0));
  let cellsB = Array(x + 2)
    .fill(0)
    .map(() => Array(y + 2).fill(0));

  rnd();

  for (let i = 0; i < x; i++) {
    let r = i < 10 ? "0" + i : i;
    let rowDiv = document.createElement("div");
    rowDiv.id = "row" + r;
    rowDiv.style.display = "flex";
    rowDiv.style.gap = "4px";
    liveContainer.appendChild(rowDiv);

    for (let j = 0; j < y; j++) {
      let a = i < 10 ? "0" + i : i;
      let b = j < 10 ? "0" + j : j;

      let cell = document.createElement("div");
      cell.id = "cell" + a + b;

      cell.style.width = "10px";
      cell.style.height = "10px";
      cell.style.display = "flex";
      cell.style.alignItems = "center";
      cell.style.justifyContent = "center";
      cell.style.margin = "0";
      cell.style.cursor = "pointer";
      cell.style.backgroundColor = "transparent";
      cell.style.border = "none";

      let pixel = document.createElement("div");
      pixel.className = "pixel-dot";
      pixel.style.width = "8px";
      pixel.style.height = "8px";
      pixel.style.borderRadius = "1px";
      pixel.style.transition = "background-color 0.1s ease";
      cell.appendChild(pixel);

      rowDiv.appendChild(cell);

      if (cells[i][j] === 0) {
        dead++;
        died(i, j);
      } else {
        alive++;
        born(i, j);
      }

      cell.addEventListener("click", () => clickon(i, j));
    }
  }

  const runBtn = document.createElement("button");
  runBtn.id = "run";
  runBtn.className = "btn";
  runBtn.innerText = "START";
  runBtn.addEventListener("click", () => {
    clearInterval(timeint);
    timeint = setInterval(run, 500);
  });
  contContainer.appendChild(runBtn);

  const clearBtn = document.createElement("button");
  clearBtn.id = "clear";
  clearBtn.className = "btn";
  clearBtn.innerText = "CLEAR";
  clearBtn.addEventListener("click", () => {
    clearInterval(timeint);
    clear();
  });
  contContainer.appendChild(clearBtn);

  const rndBtn = document.createElement("button");
  rndBtn.id = "rnd";
  rndBtn.className = "btn";
  rndBtn.innerText = "RANDOM";
  rndBtn.addEventListener("click", () => {
    clearInterval(timeint);
    rnd();
  });
  contContainer.appendChild(rndBtn);

  const infoBtn = document.createElement("button");
  infoBtn.id = "info";
  infoBtn.className = "btn";
  contContainer.appendChild(infoBtn);

  drowinfo();

  function rnd() {
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        cells[i][j] = Math.floor(Math.random() * 2);
      }
    }
    h = 0;
    dead = 0;
    alive = 0;
    drowcells();
    drowinfo();
  }

  function drowinfo() {
    const info = document.getElementById("info");
    if (!info) return;
    if (ca(cellsP, cellsN)) {
      info.innerText = `GAME OVER on turn: ${h} Dead: ${dead} Alive: ${alive}`;
      clearInterval(timeint);
    } else {
      info.innerText = `Turn: ${h} Dead: ${dead} Alive: ${alive}`;
    }
  }

  function clear() {
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        cells[i][j] = 0;
      }
    }
    h = 0;
    dead = 0;
    alive = 0;
    drowcells();
    drowinfo();
  }

  function run() {
    turn();
    drowcells();
    drowinfo();
  }

  function turn() {
    h++;
    dead = 0;
    alive = 0;
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        cellsA[i + 1][j + 1] = cells[i][j];
        if (h % 2 !== 0) cellsP[i][j] = cells[i][j];
      }
    }
    for (let i = 1; i < x + 1; i++) {
      for (let j = 1; j < y + 1; j++) {
        n = neib(cellsA, i, j);
        if (cellsA[i][j] === 0 && n === 3) {
          cellsB[i][j] = 1;
        } else if (cellsA[i][j] === 1 && n > 3) {
          cellsB[i][j] = 0;
        } else if (cellsA[i][j] === 1 && n < 2) {
          cellsB[i][j] = 0;
        } else {
          cellsB[i][j] = cellsA[i][j];
        }
      }
    }
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        cellsN[i][j] = cellsB[i + 1][j + 1];
      }
    }
    cells = cellsN;
  }

  function neib(cellsarr, i, j) {
    let count = 0;
    for (let ni = i - 1; ni < i + 2; ni++) {
      for (let nj = j - 1; nj < j + 2; nj++) {
        if (!(ni === i && nj === j)) {
          count += cellsarr[ni][nj];
        }
      }
    }
    return count;
  }

  function ca(a, b) {
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        if (a[i][j] !== b[i][j]) return false;
      }
    }
    return true;
  }

  function drowcells() {
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        if (cells[i][j] === 0) {
          dead++;
          died(i, j);
        } else {
          alive++;
          born(i, j);
        }
      }
    }
  }

  function clickon(i, j) {
    if (cells[i][j] === 1) {
      dead++;
      cells[i][j] = 0;
      died(i, j);
    } else {
      alive++;
      cells[i][j] = 1;
      born(i, j);
    }
    dead = 0;
    alive = 0;
    drowcells();
    drowinfo();
  }

  function updateCell(i, j, isAlive) {
    let a = i < 10 ? "0" + i : i;
    let b = j < 10 ? "0" + j : j;
    let cell = document.getElementById("cell" + a + b);

    if (cell) {
      let pixel = cell.querySelector(".pixel-dot");

      if (pixel) {
        if (isAlive) {
          pixel.style.backgroundColor = "var(--accent-green)";
        } else {
          pixel.style.backgroundColor = "var(--bg-dark-box)";
        }
      }
    }
  }

  function died(i, j) {
    updateCell(i, j, false);
  }

  function born(i, j) {
    updateCell(i, j, true);
  }
}
