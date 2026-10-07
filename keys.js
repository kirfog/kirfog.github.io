window.addEventListener("keydown", function (event) {
  const folders = getFolders();
  const currentFolderName = folders[currentFolderIndex];
  const filesInFolder = fileSystem[currentFolderName] || [];

  if (event.key.startsWith("F")) {
    const fNumber = parseInt(event.key.substring(1));
    if (!isNaN(fNumber) && fNumber <= folders.length) {
      event.preventDefault();
      currentFolderIndex = fNumber - 1;
      changeFolder(true);
    }
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    currentFolderIndex = (currentFolderIndex + 1) % folders.length;
    changeFolder(true);
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    currentFolderIndex =
      (currentFolderIndex - 1 + folders.length) % folders.length;
    changeFolder(true);
  } else if (event.key === "ArrowDown" && filesInFolder.length > 0) {
    event.preventDefault();
    currentFileIndex = (currentFileIndex + 1) % filesInFolder.length;
    highlightActiveFile();
    loadHtmlFile(filesInFolder[currentFileIndex].file);
  } else if (event.key === "ArrowUp" && filesInFolder.length > 0) {
    event.preventDefault();
    currentFileIndex =
      (currentFileIndex - 1 + filesInFolder.length) % filesInFolder.length;
    highlightActiveFile();
    loadHtmlFile(filesInFolder[currentFileIndex].file);
  }
});
