const fileSystem = {
  life: [{ file: "life/game.html" }],
  help: [{ file: "help/debian.html" }],
  directory: [
    { file: "directory/freeipa.html" },
    { file: "directory/user.html" },
  ],
};

let currentFolderIndex = 0;
let currentFileIndex = 0;

function getFolders() {
  return Object.keys(fileSystem);
}

async function fetchFileTitle(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) return filePath;

    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    return doc.title ? doc.title : filePath.split("/").pop();
  } catch (e) {
    return filePath.split("/").pop();
  }
}

function initFolderMenu() {
  const topMenu = document.getElementById("folder-switchers");
  if (!topMenu) return;

  topMenu.innerHTML = "";

  const folders = getFolders();

  folders.forEach((folderName, index) => {
    const btn = document.createElement("a");
    btn.className = "key-btn";
    btn.id = `btn-folder-${index}`;
    btn.innerHTML = `<span>F${index + 1}</span>${folderName.toUpperCase()}`;

    btn.onclick = () => {
      currentFolderIndex = index;
      changeFolder(true);
    };

    topMenu.appendChild(btn);
  });
}

async function changeFolder(selectFirstFile = false) {
  const folders = getFolders();

  const buttons = document.querySelectorAll(".key-btn");
  buttons.forEach((btn) => btn.classList.remove("active-folder"));

  const activeBtn = document.getElementById(`btn-folder-${currentFolderIndex}`);
  if (activeBtn) activeBtn.classList.add("active-folder");

  if (selectFirstFile) {
    currentFileIndex = 0;
  }

  await renderLeftMenu();
}

async function renderLeftMenu() {
  const container = document.getElementById("menu-container");
  const folders = getFolders();
  const currentFolderName = folders[currentFolderIndex];

  container.innerHTML = "";

  const filesInFolder = fileSystem[currentFolderName] || [];

  for (let i = 0; i < filesInFolder.length; i++) {
    const item = filesInFolder[i];
    if (!item.name) {
      item.name = await fetchFileTitle(item.file);
    }

    const link = document.createElement("a");
    link.className = "menu-link";
    link.id = `file-link-${i}`;
    link.innerText = `📄 ${item.name}`;

    link.onclick = function () {
      currentFileIndex = i;
      highlightActiveFile();
      loadHtmlFile(item.file);
    };

    container.appendChild(link);
  }

  if (currentFileIndex >= filesInFolder.length) {
    currentFileIndex = filesInFolder.length - 1;
  }
  if (currentFileIndex < 0) currentFileIndex = 0;

  highlightActiveFile();
  loadHtmlFile(filesInFolder[currentFileIndex].file);
}

function highlightActiveFile() {
  const links = document.querySelectorAll(".menu-link");
  links.forEach((link) => link.classList.remove("active"));

  const activeLink = document.getElementById(`file-link-${currentFileIndex}`);
  if (activeLink) activeLink.classList.add("active");
}

async function loadHtmlFile(filePath) {
  const outputArea = document.getElementById("output-area");

  if (outputArea) outputArea.innerHTML = "";

  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Статус ${response.status}`);

    const htmlContent = await response.text();
    if (outputArea) outputArea.innerHTML = htmlContent;

    initCodeBlocks();
    initGame();
  } catch (error) {
    if (outputArea) {
      outputArea.innerHTML = `<span style="color:#FF5555;">Ошибка загрузки ${filePath}: ${error.message}</span>`;
    }
  }
}

function initCodeBlocks() {
  const outputArea = document.getElementById("output-area");
  if (!outputArea) return;

  const blocks = outputArea.querySelectorAll("pre");

  blocks.forEach((block) => {
    if (block.querySelector(".copy-btn")) return;

    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.innerText = "🗐";

    btn.addEventListener("click", () => {
      const codeTarget = block.querySelector("code") || block;
      const codeText = codeTarget.innerText;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(codeText)
          .then(() => showSuccessState(btn))
          .catch((err) => console.error("Ошибка modern-копирования: ", err));
      } else {
        try {
          const textArea = document.createElement("textarea");
          textArea.value = codeText;
          textArea.style.position = "fixed";
          textArea.style.top = "-9999px";
          textArea.style.left = "-9999px";
          document.body.appendChild(textArea);
          textArea.select();
          textArea.setSelectionRange(0, 99999);

          const successful = document.execCommand("copy");
          document.body.removeChild(textArea);

          if (successful) showSuccessState(btn);
        } catch (err) {
          console.error("Ошибка fallback-копирования: ", err);
        }
      }
    });

    block.appendChild(btn);
  });
}

function showSuccessState(btn) {
  btn.innerText = "✓";
  btn.classList.add("copied");

  setTimeout(() => {
    btn.innerText = "🗐";
    btn.classList.remove("copied");
  }, 1500);
}

initFolderMenu();
changeFolder(true);
