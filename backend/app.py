from flask import Flask, send_from_directory, jsonify, render_template
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Aplica CORS para todas as rotas e origens

DIR_PATH = os.environ.get('DIR_PATH', 'D:\\CursoTeste')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/files')
def list_files():
    menu = {}
    for root, dirs, files in os.walk(DIR_PATH):
        path = root.split(os.sep)
        sub_menu = menu
        for folder in path[1:]:  # Começa do 1 para ignorar o diretório raiz na exibição
            if folder not in sub_menu:
                sub_menu[folder] = {}
            sub_menu = sub_menu[folder]
        sub_menu['files'] = [os.path.join(root, file) for file in files]
        sub_menu['MenuId'] = root.replace(DIR_PATH, '').replace(os.sep, '_')
    return jsonify(menu)

@app.route('/view/<path:filename>')
def view_file(filename):
    filename = secure_filename(filename)
    return send_from_directory(DIR_PATH, filename)

if __name__ == '__main__':
    app.run(debug=True, port=8000)
