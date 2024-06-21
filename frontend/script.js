document.addEventListener("DOMContentLoaded", function () {
    fetch('http://127.0.0.1:8000/files')
    .then(response => response.json())
    .then(data => {
        const menu = document.getElementById('menu');
        const filesDiv = document.getElementById('files');
        const courseHeader = document.getElementById('course-header');

        // Verifica se a primeira chave existe e usa como nome do curso
        const courseName = Object.keys(data)[0] || 'Curso Indisponível';
        courseHeader.innerHTML = '<h1>' + courseName + '</h1>';

        function createMenu(items) {
            const ul = document.createElement('ul');
            if (!items) return ul; // Retorna uma lista vazia se não houver itens

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
                }
            }
            return ul;
        }

        function updateCurrent(link) {
            const links = document.querySelectorAll('#menu a');
            links.forEach(l => l.classList.remove('current'));
            link.classList.add('current');
        }

        function createFilesList(files) {
            filesDiv.innerHTML = '';
            const list = document.createElement('ul');
            files.forEach(file => {
                const fileLi = document.createElement('li');
                fileLi.textContent = file.split('\\').pop();
                fileLi.onclick = () => displayFile(file);
                list.appendChild(fileLi);
            });
            filesDiv.appendChild(list);
        }

        function displayFile(filePath) {
            filesDiv.innerHTML = '';
            const fileName = filePath.split('\\').pop();
            if (fileName.endsWith('.mp4')) {
                const video = document.createElement('video');
                video.src = filePath;
                video.controls = true;
                filesDiv.appendChild(video);
            } else if (fileName.endsWith('.png') || fileName.endsWith('.jpg')) {
                const img = document.createElement('img');
                img.src = filePath;
                filesDiv.appendChild(img);
            } else if (fileName.endsWith('.pdf')) {
                const iframe = document.createElement('iframe');
                iframe.src = filePath;
                iframe.style.width = '100%';
                iframe.style.height = '500px';
                filesDiv.appendChild(iframe);
            }
        }

        menu.appendChild(createMenu(data[courseName])); // Cria o menu usando os dados do curso
    })
    .catch(error => {
        console.error('Error fetching files:', error);
        menu.textContent = 'Erro ao buscar diretórios.';
    });
});
