document.addEventListener("DOMContentLoaded", function () {
  fetch("http://127.0.0.1:8000/files")
    .then((response) => response.json())
    .then((data) => {
      const menu = document.getElementById("menu");
      const filesDiv = document.getElementById("files");
      const courseHeader = document.getElementById("course-header");
      const courseName = Object.keys(data)[0] || "Curso Indisponível";
      courseHeader.innerHTML = "<h1>" + courseName + "</h1>";

      function createMenu(items) {
        const ul = document.createElement("ul");
        for (const key in items) {
          if (
            typeof items[key] === "object" &&
            items[key] !== null &&
            key !== "files"
          ) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.textContent = key;
            a.href = "#";
            a.dataset.menuId = items[key].MenuId;
            a.onclick = (event) => {
              event.preventDefault();
              updateCurrent(event.target);
              filesDiv.innerHTML = "";
              if (items[key] && items[key].files) {
                createFilesList(items[key].files, items[key].MenuId);
              }
            };
            li.appendChild(a);
            li.appendChild(createMenu(items[key])); // Recursão para subdiretórios
            ul.appendChild(li);

            // Check if the module is already marked as complete
            if (localStorage.getItem(items[key].MenuId + "-module") === "completed") {
              a.classList.add("completed");
              a.innerHTML += " ✅"; // Add checkmark icon
            }
          }
        }
        return ul;
      }

      function updateCurrent(link) {
        const links = document.querySelectorAll("#menu a");
        links.forEach((l) => l.classList.remove("current"));
        link.classList.add("current");
      }

      function createFilesList(files, menuId) {
        filesDiv.innerHTML = "";
        const videoSection = document.createElement("div");
        videoSection.className = "row";
        const otherFilesSection = document.createElement("div");
        otherFilesSection.className = "row";

        files.forEach(file => {
          const fileName = file.split("\\").pop();
          const elementType = determineFileType(fileName);
          const completed = localStorage.getItem(file) === "completed";

          switch (elementType) {
            case 'video':
              displayVideo(file, fileName, menuId, videoSection, completed);
              break;
            case 'image':
              displayImage(file, fileName, menuId, otherFilesSection, completed);
              break;
            case 'pdf':
              displayPdf(file, fileName, menuId, otherFilesSection, completed);
              break;
            default:
              displayLink(file, fileName, menuId, otherFilesSection, completed);
              break;
          }
        });

        filesDiv.appendChild(videoSection);
        filesDiv.appendChild(otherFilesSection);
      }

      function determineFileType(fileName) {
        if (fileName.endsWith(".mp4")) {
          return 'video';
        } else if (fileName.endsWith(".png") || fileName.endsWith(".jpg")) {
          return 'image';
        } else if (fileName.endsWith(".pdf")) {
          return 'pdf';
        } else {
          return 'other';
        }
      }

      function displayVideo(file, fileName, menuId, parentElement, completed) {
        const col = document.createElement("div");
        col.className = "col-sm-12 mb-3";
        const card = document.createElement("div");
        card.className = "card";
      
        const cardHeader = document.createElement("div");
        cardHeader.className = "card-header d-flex justify-content-between align-items-center";
        const videoTitle = document.createElement("h5");
        videoTitle.className = "card-title m-0";
        videoTitle.textContent = fileName.replace(/\.[^/.]+$/, ""); 
        cardHeader.appendChild(videoTitle);
      
        const completeButton = document.createElement("button");
        completeButton.textContent = "Completo";
        completeButton.className = "complete-button btn btn-success ml-2";
        completeButton.onclick = function () {
          localStorage.setItem(menuId + "-" + file, "completed");
          completeButton.style.display = "none";
          uncompleteButton.style.display = "inline-block";
          checkModuleCompletion(menuId); // Check module completion when marking a file as complete
        };
      
        const uncompleteButton = document.createElement("button");
        uncompleteButton.textContent = "Desmarcar Completo";
        uncompleteButton.className = "complete-button btn btn-danger ml-2";
        uncompleteButton.onclick = function () {
          localStorage.removeItem(menuId + "-" + file);
          completeButton.style.display = "inline-block";
          uncompleteButton.style.display = "none";
          checkModuleCompletion(menuId); // Check module completion when unmarking a file as complete
        };
      
        if (completed) {
          completeButton.style.display = "none";
        } else {
          uncompleteButton.style.display = "none";
        }
      
        cardHeader.appendChild(completeButton);
        cardHeader.appendChild(uncompleteButton);
      
        const cardBody = document.createElement("div");
        cardBody.className = "card-body";
      
        const video = document.createElement("video");
        video.className = "video-test";
        video.src = file;
        video.controls = true;
        cardBody.appendChild(video);
      
        const br = document.createElement("br");
        cardBody.appendChild(br);

        const speedControlLabel = document.createElement("label");
        speedControlLabel.className = "mt-2";
        speedControlLabel.textContent = "Controle de Velocidade: ";
        const speedSelector = document.createElement("select");
        speedSelector.className = "speed-selector ml-2";
        const speeds = [1, 1.5, 2, 2.5, 2.7, 2.9, 3, 3.1, 3.2, 3.3];
        speeds.forEach((speed) => {
          const option = document.createElement("option");
          option.value = speed;
          option.textContent = `${speed}x`;
          speedSelector.appendChild(option);
        });
      
        speedSelector.addEventListener("change", function () {
          video.playbackRate = parseFloat(this.value);
        });
      
        cardBody.appendChild(speedControlLabel);
        cardBody.appendChild(speedSelector);
      
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        col.appendChild(card);
        parentElement.appendChild(col);
      }
      

      function displayImage(file, fileName, menuId, parentElement, completed) {
        const col = document.createElement("div");
        col.className = "col-sm-4 mb-3";
        const card = document.createElement("div");
        card.className = "card";

        const cardHeader = document.createElement("div");
        cardHeader.className = "card-header d-flex justify-content-between align-items-center";
        const imageTitle = document.createElement("h5");
        imageTitle.className = "card-title m-0";
        imageTitle.textContent = fileName.replace(/\.[^/.]+$/, ""); 
        cardHeader.appendChild(imageTitle);

        const completeButton = document.createElement("button");
        completeButton.textContent = "Completo";
        completeButton.className = "complete-button btn btn-success ml-2";
        completeButton.onclick = function () {
          localStorage.setItem(menuId + "-" + file, "completed");
          completeButton.style.display = "none";
          uncompleteButton.style.display = "inline-block";
          checkModuleCompletion(menuId); // Check module completion when marking a file as complete
        };

        const uncompleteButton = document.createElement("button");
        uncompleteButton.textContent = "Desmarcar Completo";
        uncompleteButton.className = "complete-button btn btn-danger ml-2";
        uncompleteButton.onclick = function () {
          localStorage.removeItem(menuId + "-" + file);
          completeButton.style.display = "inline-block";
          uncompleteButton.style.display = "none";
          checkModuleCompletion(menuId); // Check module completion when unmarking a file as complete
        };

        if (completed) {
          completeButton.style.display = "none";
        } else {
          uncompleteButton.style.display = "none";
        }

        cardHeader.appendChild(completeButton);
        cardHeader.appendChild(uncompleteButton);

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const image = document.createElement("img");
        image.src = file;
        image.alt = fileName;
        image.className = "img-thumbnail";
        image.onclick = function () {
          document.getElementById("modalImage").src = this.src;
          $("#imageModal").modal("show");
        };
        cardBody.appendChild(image);

        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        col.appendChild(card);
        parentElement.appendChild(col);
      }

      function displayPdf(file, fileName, menuId, parentElement, completed) {
        const col = document.createElement("div");
        col.className = "col-sm-4 mb-3";
        const card = document.createElement("div");
        card.className = "card";

        const cardHeader = document.createElement("div");
        cardHeader.className = "card-header d-flex justify-content-between align-items-center";
        const pdfTitle = document.createElement("h5");
        pdfTitle.className = "card-title m-0";
        pdfTitle.textContent =fileName.replace(/\.[^/.]+$/, ""); 
        cardHeader.appendChild(pdfTitle);

        const completeButton = document.createElement("button");
        completeButton.textContent = "Completo";
        completeButton.className = "complete-button btn btn-success ml-2";
        completeButton.onclick = function () {
          localStorage.setItem(menuId + "-" + file, "completed");
          completeButton.style.display = "none";
          uncompleteButton.style.display = "inline-block";
          checkModuleCompletion(menuId); // Check module completion when marking a file as complete
        };

        const uncompleteButton = document.createElement("button");
        uncompleteButton.textContent = "Desmarcar Completo";
        uncompleteButton.className = "complete-button btn btn-danger ml-2";
        uncompleteButton.onclick = function () {
          localStorage.removeItem(menuId + "-" + file);
          completeButton.style.display = "inline-block";
          uncompleteButton.style.display = "none";
          checkModuleCompletion(menuId); // Check module completion when unmarking a file as complete
        };

        if (completed) {
          completeButton.style.display = "none";
        } else {
          uncompleteButton.style.display = "none";
        }

        cardHeader.appendChild(completeButton);
        cardHeader.appendChild(uncompleteButton);

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const link = document.createElement("a");
        link.href = file;
        link.textContent = fileName;
        link.className = "pdf-link";
        cardBody.appendChild(link);

        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        col.appendChild(card);
        parentElement.appendChild(col);
      }

      function displayLink(file, fileName, menuId, parentElement, completed) {
        const col = document.createElement("div");
        col.className = "col-sm-4 mb-3";
        const card = document.createElement("div");
        card.className = "card";

        const cardHeader = document.createElement("div");
        cardHeader.className = "card-header d-flex justify-content-between align-items-center";
        const linkTitle = document.createElement("h5");
        linkTitle.className = "card-title m-0";
        linkTitle.textContent = fileName.replace(/\.[^/.]+$/, ""); 
        cardHeader.appendChild(linkTitle);

        const completeButton = document.createElement("button");
        completeButton.textContent = "Completo";
        completeButton.className = "complete-button btn btn-success ml-2";
        completeButton.onclick = function () {
          localStorage.setItem(menuId + "-" + file, "completed");
          completeButton.style.display = "none";
          uncompleteButton.style.display = "inline-block";
          checkModuleCompletion(menuId); // Check module completion when marking a file as complete
        };

        const uncompleteButton = document.createElement("button");
        uncompleteButton.textContent = "Desmarcar Completo";
        uncompleteButton.className = "complete-button btn btn-danger ml-2";
        uncompleteButton.onclick = function () {
          localStorage.removeItem(menuId + "-" + file);
          completeButton.style.display = "inline-block";
          uncompleteButton.style.display = "none";
          checkModuleCompletion(menuId); // Check module completion when unmarking a file as complete
        };

        if (completed) {
          completeButton.style.display = "none";
        } else {
          uncompleteButton.style.display = "none";
        }

        cardHeader.appendChild(completeButton);
        cardHeader.appendChild(uncompleteButton);

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const link = document.createElement("a");
        link.href = file;
        link.textContent = fileName;
        link.className = "file-link";
        cardBody.appendChild(link);

        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        col.appendChild(card);
        parentElement.appendChild(col);
      }

      function checkModuleCompletion(menuId) {
        const { files } = getFilesForModuleById(menuId, data[courseName]);
        let allCompleted = true;
        files.forEach(file => {
          if (localStorage.getItem(menuId + "-" + file) !== "completed") {
            allCompleted = false;
          }
        });

        if (allCompleted) {
          localStorage.setItem(menuId + "-module", "completed");
        } else {
          localStorage.removeItem(menuId + "-module");
        }
        updateMenu();
      }

      function getFilesForModuleById(menuId, items) {
        let files = [];

        for (const key in items) {
          if (items[key].MenuId === menuId) {
            if (items[key].files) {
              files = items[key].files.slice(); // Use slice to copy the array
            }
            Object.keys(items[key]).forEach(subKey => {
              if (typeof items[key][subKey] === 'object' && items[key][subKey] !== null && subKey !== 'files') {
                const result = getFilesForModuleById(menuId, items[key]);
                files = files.concat(result.files);
              }
            });
            break; // Stop searching once we found the module by ID
          } else if (typeof items[key] === 'object' && items[key] !== null) {
            const result = getFilesForModuleById(menuId, items[key]);
            files = files.concat(result.files);
          }
        }
        return { files };
      }

      function updateMenu() {
        const moduleLinks = document.querySelectorAll("#menu a");
        moduleLinks.forEach(link => {
          const menuId = link.dataset.menuId;
          if (localStorage.getItem(menuId + "-module") === "completed") {
            link.classList.add('completed');
            if (!link.innerHTML.includes(" ✅")) {
              link.innerHTML += " ✅";
            }
          } else {
            link.classList.remove('completed');
            link.innerHTML = link.textContent.trim();
          }
          console.log("Updating menu for:", menuId, "Completed:", localStorage.getItem(menuId + "-module"));
        });
      }

      menu.appendChild(createMenu(data[courseName]));
      updateMenu(); // Update the menu on page load
    })
    .catch((error) => {
      console.error("Error fetching files:", error);
      filesDiv.textContent = "Erro ao buscar diretórios.";
    });
});
