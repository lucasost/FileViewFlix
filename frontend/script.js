document.addEventListener('DOMContentLoaded', function () {
    fetch('http://127.0.0.1:8000/files')
    .then(response => response.json())
    .then(files => {
        const sidebar = document.getElementById('sidebar');
        const directories = {};

        // Modal
        const modal = document.getElementById("imageModal");
        const modalImg = document.getElementById("img01");
        const span = document.getElementsByClassName("close")[0];

        span.onclick = function() { 
            modal.style.display = "none";
        }

        // Função de comparação personalizada para ordenação natural
        function naturalCompare(a, b) {
            const ax = [], bx = [];

            a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
                ax.push([$1 || Infinity, $2 || ""]);
            });
            b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
                bx.push([$1 || Infinity, $2 || ""]);
            });

            while (ax.length && bx.length) {
                const an = ax.shift();
                const bn = bx.shift();
                const nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                if (nn) return nn;
            }

            return ax.length - bx.length;
        }

        // Construir a hierarquia de diretórios
        const commonPrefix = findCommonPathPrefix(files);
        const basePathLength = commonPrefix.length + 1; // +1 para incluir a barra invertida no final do prefixo

        // Construir a hierarquia de diretórios com caminhos relativos
        files.forEach(file => {
            const relativePath = file.substring(basePathLength);
            const pathParts = relativePath.split('\\');
            const fileName = pathParts.pop();
            let currentLevel = directories;

            pathParts.forEach((part, index) => {
                if (!currentLevel[part]) {
                    currentLevel[part] = (index === pathParts.length - 1) ? [] : {};
                }
                currentLevel = currentLevel[part];
            });

            currentLevel.push(fileName); // Armazenar apenas o nome do arquivo para simplificação
        });

        // Aqui você chamaria uma função para renderizar a estrutura de diretórios, por exemplo:
        renderDirectory(directories, sidebar);

        // Função recursiva para renderizar a estrutura hierárquica
        function renderDirectory(directory, parentElement, parentId) {
            const sortedKeys = Object.keys(directory).sort(naturalCompare);

            sortedKeys.forEach((key, index) => {
                const item = directory[key];
                const id = parentId ? `${parentId}-${index}` : `section-${index}`;

                if (Array.isArray(item)) {
                    // Renderizar arquivos no diretório
                    const filesList = document.createElement('div');
                    filesList.className = 'list-group list-group-flush';
                    item.sort(naturalCompare).forEach(file => {
                        const fileElement = document.createElement('a');
                        fileElement.className = 'list-group-item list-group-item-action';
                        const fileName = file.split('\\').pop();
                        fileElement.textContent = fileName;

                        fileElement.addEventListener('click', function(event) {
                            event.preventDefault();
                            fileList.innerHTML = '';

                            if (fileName.endsWith('.mp4')) {
                                const videoWrapper = document.createElement('div');
                                const videoTitle = document.createElement('h3');
                                videoTitle.textContent = fileName;
                                videoWrapper.appendChild(videoTitle);

                                const video = document.createElement('video');
                                video.src = file;
                                video.controls = true;
                                videoWrapper.appendChild(video);

                                const speedSelector = document.createElement('select');
                                speedSelector.className = 'speed-selector';
                                const speeds = [1, 1.5, 2, 2.5, 2.7, 2.9, 3, 3.1, 3.2, 3.3];
                                speeds.forEach(speed => {
                                    const option = document.createElement('option');
                                    option.value = speed;
                                    option.textContent = `${speed}x`;
                                    speedSelector.appendChild(option);
                                });

                                speedSelector.addEventListener('change', function () {
                                    video.playbackRate = this.value;
                                });

                                videoWrapper.appendChild(speedSelector);

                                const completeButton = document.createElement('button');
                                completeButton.textContent = 'Completo';
                                completeButton.className = 'complete-button';
                                completeButton.onclick = function () {
                                    localStorage.setItem(file, 'completed');
                                    completeButton.disabled = true;
                                    updateDirectoryCompletionStatus(directory);
                                };

                                if (localStorage.getItem(file) === 'completed') {
                                    completeButton.disabled = true;
                                }

                                videoWrapper.appendChild(completeButton);
                                fileList.appendChild(videoWrapper);
                            } else if (fileName.endsWith('.png') || fileName.endsWith('.jpg')) {
                                const image = document.createElement('img');
                                image.src = file;
                                image.className = 'thumbnail';
                                image.onclick = function() {
                                    modal.style.display = "block";
                                    modalImg.src = this.src;
                                }
                                fileList.appendChild(image);
                            } else {
                                const link = document.createElement('a');
                                link.href = file;
                                link.textContent = fileName;
                                link.className = 'file-link';
                                fileList.appendChild(link);
                            }
                        });

                        filesList.appendChild(fileElement);
                    });

                    const collapseDiv = document.createElement('div');
                    collapseDiv.className = 'collapse';
                    collapseDiv.id = id;
                    collapseDiv.appendChild(filesList);

                    const cardBody = document.createElement('div');
                    cardBody.className = 'card-body';
                    cardBody.appendChild(collapseDiv);

                    const cardHeader = document.createElement('div');
                    cardHeader.className = 'card-header';
                    cardHeader.innerHTML = `<h5 class="mb-0"><button class="btn btn-link" data-toggle="collapse" data-target="#${id}" aria-expanded="false" aria-controls="${id}">${key}</button></h5>`;

                    const card = document.createElement('div');
                    card.className = 'card';
                    card.appendChild(cardHeader);
                    card.appendChild(cardBody);

                    parentElement.appendChild(card);
                } else {
                    // Renderizar subdiretório
                    const subdirElement = document.createElement('div');
                    subdirElement.className = 'ml-3';
                    renderDirectory(item, subdirElement, id);

                    const collapseDiv = document.createElement('div');
                    collapseDiv.className = 'collapse';
                    collapseDiv.id = id;
                    collapseDiv.appendChild(subdirElement);

                    const cardBody = document.createElement('div');
                    cardBody.className = 'card-body';
                    cardBody.appendChild(collapseDiv);

                    const cardHeader = document.createElement('div');
                    cardHeader.className = 'card-header';
                    cardHeader.innerHTML = `<h5 class="mb-0"><button class="btn btn-link" data-toggle="collapse" data-target="#${id}" aria-expanded="false" aria-controls="${id}">${key}</button></h5>`;

                    const card = document.createElement('div');
                    card.className = 'card';
                    card.appendChild(cardHeader);
                    card.appendChild(cardBody);

                    parentElement.appendChild(card);
                }
            });
        }

        renderDirectory(directories, sidebar);

        function updateDirectoryCompletionStatus(directoryPath) {
            const dirLink = document.querySelector(`a[data-path="${directoryPath}"]`);
            if (!directories[directoryPath]) return;
            const allCompleted = directories[directoryPath].every(file => localStorage.getItem(file) === 'completed');
            if (allCompleted) {
                dirLink.classList.add('completed-directory');
            } else {
                dirLink.classList.remove('completed-directory');
            }
        }
    })
    .catch(error => {
        console.error('Error fetching files:', error);
        sidebar.textContent = 'Erro ao buscar diretórios.';
    });
});


function findCommonPathPrefix(paths) {
    if (paths.length === 0) return '';
    
    let prefix = paths[0];
    for (let i = 1; i < paths.length; i++) {
        while (paths[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.lastIndexOf('\\'));
            if (prefix === '') return '';
        }
    }
    return prefix;
}