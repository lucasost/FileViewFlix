document.addEventListener("DOMContentLoaded", function () {
    fetch('http://127.0.0.1:8000/files')
    .then(response => response.json())
    .then(data => {
        const menu = document.getElementById('menu');
        const filesDiv = document.getElementById('files');
        const courseHeader = document.getElementById('course-header');
        const courseName = Object.keys(data)[0] || 'Curso Indisponível';
        courseHeader.innerHTML = '<h1>' + courseName + '</h1>';

        function createMenu(items) {
            const ul = document.createElement("ul");
            let firstFile = null;
            for (const key in items) {
                if (typeof items[key] === 'object' && items[key] !== null && key !== 'files') {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.textContent = key;
                    a.href = '#';
                    a.onclick = (event) => {
                        event.preventDefault();
                        updateCurrent(event.target);
                        filesDiv.innerHTML = '';
                        if (items[key] && items[key].files) {
                            createFilesList(items[key].files);
                            checkModuleCompletion(key, items[key].files); // Check if module is complete
                        }
                    };
                    li.appendChild(a);
                    li.appendChild(createMenu(items[key])); // Recursão para subdiretórios
                    ul.appendChild(li);
                    firstFile = firstFile || (items[key].files && items[key].files[0]);

                    // Check if the module is already marked as complete
                    if (localStorage.getItem(key + "-module") === "completed") {
                        a.classList.add('completed');
                        a.innerHTML += " ✅"; // Add checkmark icon
                    }
                }
            }
            if (!firstFile && ul.firstChild) {
                ul.firstChild.firstChild.click(); // Auto click the first menu item if no files were found
            }
            return ul;
        }

        function updateCurrent(link) {
            const links = document.querySelectorAll("#menu a");
            links.forEach(l => l.classList.remove('current'));
            link.classList.add('current');
        }

        function createFilesList(files) {
            filesDiv.innerHTML = '';
            let videoDisplayed = false;  // Flag to check if a video has been displayed

            const videoSection = document.createElement('div');
            videoSection.className = "row";
            const otherFilesSection = document.createElement('div');
            otherFilesSection.className = "row";

            files.forEach(file => {
                const fileName = file.split("\\").pop();
                if (fileName.endsWith(".mp4") && !videoDisplayed) {
                    displayVideo(file, fileName, videoSection);
                    videoDisplayed = true;
                } else if (fileName.endsWith(".png") || fileName.endsWith(".jpg")) {
                    displayImage(file, fileName, otherFilesSection);
                } else if (fileName.endsWith(".pdf")) {
                    displayPdf(file, fileName, otherFilesSection);
                } else {
                    displayLink(file, fileName, otherFilesSection);
                }
            });

            filesDiv.appendChild(videoSection);
            filesDiv.appendChild(otherFilesSection);
        }

        function displayVideo(file, fileName, parentElement) {
            const col = document.createElement("div");
            col.className = "col-sm-12";
            const card = document.createElement("div");
            card.className = "card";
            const cardBody = document.createElement("div");
            cardBody.className = "card-body";
            
            const videoTitle = document.createElement("h5");
            videoTitle.className = "card-title";
            videoTitle.textContent = "Vídeos";
            cardBody.appendChild(videoTitle);

            const videoDescription = document.createElement("p");
            videoDescription.className = "card-text";
            videoDescription.textContent = fileName;
            cardBody.appendChild(videoDescription);

            const video = document.createElement("video");
            video.className = "video-test";
            video.src = file;
            video.controls = true;
            cardBody.appendChild(video);

            const speedSelector = document.createElement("select");
            speedSelector.className = "speed-selector";
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

            cardBody.appendChild(speedSelector);

            const completeButton = document.createElement("button");
            completeButton.textContent = "Completo";
            completeButton.className = "complete-button btn btn-success";
            completeButton.onclick = function () {
                localStorage.setItem(file, "completed");
                completeButton.style.display = 'none';
                uncompleteButton.style.display = 'inline-block';
                checkModuleCompletion(fileName.split("\\")[1], [file]); // Check module completion when marking a file as complete
                updateMenu();
            };

            if (localStorage.getItem(file) === "completed") {
                completeButton.style.display = 'none';
            }

            const uncompleteButton = document.createElement("button");
            uncompleteButton.textContent = "Desmarcar Completo";
            uncompleteButton.className = "complete-button btn btn-danger";
            uncompleteButton.onclick = function () {
                localStorage.removeItem(file, "completed");
                completeButton.style.display = 'inline-block';
                uncompleteButton.style.display = 'none';
                checkModuleCompletion(fileName.split("\\")[1], [file]); // Check module completion when unmarking a file as complete
                updateMenu();
            };

            if (localStorage.getItem(file) !== "completed") {
                uncompleteButton.style.display = 'none';
            }

            cardBody.appendChild(completeButton);
            cardBody.appendChild(uncompleteButton);
            card.appendChild(cardBody);
            col.appendChild(card);
            parentElement.appendChild(col);
        }

        function displayImage(file, fileName, parentElement) {
            const col = document.createElement("div");
            col.className = "col-sm-4";
            const card = document.createElement("div");
            card.className = "card";
            const cardBody = document.createElement("div");
            cardBody.className = "card-body";

            const imageTitle = document.createElement("h5");
            imageTitle.className = "card-title";
            imageTitle.textContent = "Imagens";
            cardBody.appendChild(imageTitle);

            const imageDescription = document.createElement("p");
            imageDescription.className = "card-text";
            imageDescription.textContent = fileName;
            cardBody.appendChild(imageDescription);

            const image = document.createElement("img");
            image.src = file;
            image.alt = fileName;
            image.className = "img-thumbnail";
            image.onclick = function () {
                document.getElementById('modalImage').src = this.src;
                $('#imageModal').modal('show');
            };
            cardBody.appendChild(image);

            const completeButton = document.createElement("button");
            completeButton.textContent = "Completo";
            completeButton.className = "complete-button btn btn-success";
            completeButton.onclick = function () {
                localStorage.setItem(file, "completed");
                completeButton.style.display = 'none';
                uncompleteButton.style.display = 'inline-block';
                checkModuleCompletion(fileName.split("\\")[1], [file]); // Check module completion when marking a file as complete
                updateMenu();
            };

            if (localStorage.getItem(file) === "completed") {
                completeButton.style.display = 'none';
            }

            const uncompleteButton = document.createElement("button");
            uncompleteButton.textContent = "Desmarcar Completo";
            uncompleteButton.className = "complete-button btn btn-danger";
            uncompleteButton.onclick = function () {
                localStorage.removeItem(file, "completed");
                completeButton.style.display = 'inline-block';
                uncompleteButton.style.display = 'none';
                checkModuleCompletion(fileName.split("\\")[1], [file]); // Check module completion when unmarking a file as complete
                updateMenu();
            };

            if (localStorage.getItem(file) !== "completed") {
                uncompleteButton.style.display = 'none';
            }

            cardBody.appendChild(completeButton);
            cardBody.appendChild(uncompleteButton);

            card.appendChild(cardBody);
            col.appendChild(card);
            parentElement.appendChild(col);
        }

        function displayPdf(file, fileName, parentElement) {
            const col = document.createElement("div");
            col.className = "col-sm-4";
            const card = document.createElement("div");
            card.className = "card";
            const cardBody = document.createElement("div");
            cardBody.className = "card-body";

            const pdfTitle = document.createElement("h5");
            pdfTitle.className = "card-title";
            pdfTitle.textContent = "PDFs";
            cardBody.appendChild(pdfTitle);

            const pdfDescription = document.createElement("p");
            pdfDescription.className = "card-text";
            pdfDescription.textContent = fileName;
            cardBody.appendChild(pdfDescription);

            const link = document.createElement("a");
            link.href = file;
            link.textContent = fileName;
            link.className = "pdf-link";
            cardBody.appendChild(link);

            const completeButton = document.createElement("button");
            completeButton.textContent = "Completo";
            completeButton.className = "complete-button btn btn-success";
            completeButton.onclick = function () {
                localStorage.setItem(file, "completed");
                completeButton.style.display = 'none';
                uncompleteButton.style.display = 'inline-block';
                checkModuleCompletion(fileName.split("\\")[1], [file]); // Check module completion when marking a file as complete
                updateMenu();
            };

            if (localStorage.getItem(file) === "completed") {
                completeButton.style.display = 'none';
            }

            const uncompleteButton = document.createElement("button");
            uncompleteButton.textContent = "Desmarcar Completo";
            uncompleteButton.className = "complete-button btn btn-danger";
            uncompleteButton.onclick = function () {
                localStorage.removeItem(file, "completed");
                completeButton.style.display = 'inline-block';
                uncompleteButton.style.display = 'none';
                checkModuleCompletion(fileName.split("\\")[1], [file]); // Check module completion when unmarking a file as complete
                updateMenu();
            };

            if (localStorage.getItem(file) !== "completed") {
                uncompleteButton.style.display = 'none';
            }

            cardBody.appendChild(completeButton);
            cardBody.appendChild(uncompleteButton);

            card.appendChild(cardBody);
            col.appendChild(card);
            parentElement.appendChild(col);
        }

        function displayLink(file, fileName, parentElement) {
            const col = document.createElement("div");
            col.className = "col-sm-4";
            const card = document.createElement("div");
            card.className = "card";
            const cardBody = document.createElement("div");
            cardBody.className = "card-body";

            const linkTitle = document.createElement("h5");
            linkTitle.className = "card-title";
            linkTitle.textContent = "Outros Arquivos";
            cardBody.appendChild(linkTitle);

            const linkDescription = document.createElement("p");
            linkDescription.className = "card-text";
            linkDescription.textContent = fileName;
            cardBody.appendChild(linkDescription);

            const link = document.createElement("a");
            link.href = file;
            link.textContent = fileName;
            link.className = "file-link";
            cardBody.appendChild(link);

            const completeButton = document.createElement("button");
            completeButton.textContent = "Completo";
            completeButton.className = "complete-button btn btn-success";
            completeButton.onclick = function () {
                localStorage.setItem(file, "completed");
                completeButton.style.display = 'none';
                uncompleteButton.style.display = 'inline-block';
                checkModuleCompletion(fileName.split("\\")[1], [file]); // Check module completion when marking a file as complete
                updateMenu();
            };

            if (localStorage.getItem(file) === "completed") {
                completeButton.style.display = 'none';
            }

            const uncompleteButton = document.createElement("button");
            uncompleteButton.textContent = "Desmarcar Completo";
            uncompleteButton.className = "complete-button btn btn-danger";
            uncompleteButton.onclick = function () {
                localStorage.removeItem(file, "completed");
                completeButton.style.display = 'inline-block';
                uncompleteButton.style.display = 'none';
                checkModuleCompletion(fileName.split("\\")[1], [file]); // Check module completion when unmarking a file as complete
                updateMenu();
            };

            if (localStorage.getItem(file) !== "completed") {
                uncompleteButton.style.display = 'none';
            }

            cardBody.appendChild(completeButton);
            cardBody.appendChild(uncompleteButton);

            card.appendChild(cardBody);
            col.appendChild(card);
            parentElement.appendChild(col);
        }

        function checkModuleCompletion(moduleName, files) {
            let allCompleted = true;
            files.forEach(file => {
                if (localStorage.getItem(file) !== "completed") {
                    allCompleted = false;
                }
            });

            if (allCompleted) {
                localStorage.setItem(moduleName + "-module", "completed");
            } else {
                localStorage.removeItem(moduleName + "-module");
            }

            updateMenu();
        }

        function updateMenu() {
            const moduleLinks = document.querySelectorAll("#menu a");
            moduleLinks.forEach(link => {
                const moduleName = link.textContent.trim().split(" ")[0];
                if (localStorage.getItem(moduleName + "-module") === "completed") {
                    link.classList.add('completed');
                    if (!link.innerHTML.includes("✅")) {
                        link.innerHTML += " ✅"; // Add checkmark icon
                    }
                } else {
                    link.classList.remove('completed');
                    link.innerHTML = link.innerHTML.replace(" ✅", ""); // Remove checkmark icon
                }
            });
        }

        menu.appendChild(createMenu(data[courseName]));
        updateMenu(); // Update the menu on page load
    })
    .catch(error => {
        console.error('Error fetching files:', error);
        filesDiv.textContent = 'Erro ao buscar diretórios.';
    });
});
