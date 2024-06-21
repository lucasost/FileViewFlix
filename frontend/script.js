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
                                }
                            };
                            li.appendChild(a);
                            li.appendChild(createMenu(items[key])); // Recursão para subdiretórios
                            ul.appendChild(li);
                            firstFile = firstFile || (items[key].files && items[key].files[0]);
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
                    files.forEach(file => {
                        const fileName = file.split("\\").pop();
                        if (fileName.endsWith(".mp4")) {
                            displayVideo(file, fileName);
                            return;
                        }
                    });
                }

                function displayVideo(file, fileName) {
                    const videoWrapper = document.createElement("div");
                    const videoTitle = document.createElement("h3");
                    videoTitle.textContent = fileName; // Display video title
                    videoWrapper.appendChild(videoTitle);

                    const video = document.createElement("video");
                    video.classList.add("video-test")
                    video.src = file;
                    video.controls = true;
                    videoWrapper.appendChild(video);

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

                    videoWrapper.appendChild(speedSelector);
                    filesDiv.appendChild(videoWrapper);
                }

                menu.appendChild(createMenu(data[courseName]));
            })
            .catch(error => {
                console.error('Error fetching files:', error);
                filesDiv.textContent = 'Erro ao buscar diretórios.';
            });
        });