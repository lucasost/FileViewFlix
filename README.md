# FileViewFlix

- Projeto Flask de Listagem e Visualização de Arquivos

## Descrição

Este projeto é uma aplicação web construída usando Flask para listar e visualizar arquivos de um diretório específico no servidor. A aplicação suporta a visualização de arquivos de vídeo, áudio, imagem, PDF, HTML e texto diretamente na interface web.

## Funcionalidades

1. **Listar Arquivos e Diretórios**: Percorre um diretório específico e cria uma estrutura de menu baseada na hierarquia de pastas e arquivos.
2. **Visualização de Arquivos**: Exibe arquivos de vídeo, áudio, imagem, PDF, HTML e texto diretamente na interface web usando `iframe` e outros elementos HTML.
3. **Marcação de Arquivos Completos**: Permite ao usuário marcar arquivos como completos e salvar essa informação no `localStorage` do navegador.
4. **Link para Abrir Arquivos**: Adiciona links para abrir arquivos HTML e texto em uma nova aba.

## Como Rodar a Aplicação

### Pré-requisitos

- **Python**: Certifique-se de ter o Python instalado (versão 3.6 ou superior). [Baixar Python](https://www.python.org/downloads/)
- **Dependências do Python**: Instale as dependências necessárias executando o seguinte comando:

  ```sh
  pip install -r requirements.txt
  ```

### Rodando a aplicação


1. **Configurar o Diretório de Arquivos**:
   * Abra o arquivo **app.py** no Visual Studio Code ou no editor de sua preferência.
   * Altere a variável `DIR_PATH` para o diretório que deseja visualizar:

```sh
  DIR_PATH = os.environ.get('DIR_PATH', 'D:\\CaminhoArquivoCurso')
```

2. **Executar a Aplicação**:
   * Navegue até o diretório onde o arquivo `app.py` está localizado.
   * Execute o comando abaixo no terminal (certifique-se de estar no diretório correto):

  ```sh
  python app.py
  ```
     
   * A aplicação estará disponível em `http://127.0.0.1:8000`.
3. **Verificar Listagem de Arquivos**:
   * Acesse o endereço `http://127.0.0.1:8000/files` em seu navegador para verificar se os arquivos estão sendo listados. OBS: Certifique-se de que a porta *8000* não esteja sendo usada por outro serviço.
4. **Abrir o Frontend**:
   * Navegue até a pasta `frontend` e abra o arquivo `index.html` em seu navegador.
   * Agora você terá diversos recursos para visualizar arquivos localmente, como controle de velocidade de vídeo, visualização de arquivos de texto, e a opção de marcar arquivos como concluídos. Após todos os arquivos de um diretório serem marcados como concluídos, o menu é atualizado automaticamente.

## Estrutura do Projeto

### Backend

* **app.py**: Script principal que contém a aplicação Flask.

### Frontend

* **index.html**: Arquivo HTML principal para a renderização da página.
* **style.css**: Arquivo de estilos CSS para a estilização da página.
* **script.js**: Arquivo JavaScript para manipulação do DOM e funcionalidades interativas.

## Notas

* Certifique-se de que o diretório especificado em `DIR_PATH` contém os arquivos que você deseja listar e visualizar.
* Esta aplicação é apenas para fins educacionais e deve ser usada em um ambiente seguro e controlado.
