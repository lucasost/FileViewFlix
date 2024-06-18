from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Aplica CORS para todas as rotas e origens

@app.route('/files')
def list_files():
    path = 'D:\Torrents\[PACK] Elemar JR'
    files = [os.path.join(dp, f) for dp, dn, filenames in os.walk(path) for f in filenames]
    return jsonify(files)

@app.route('/view/<filename>')
def view_file(filename):
    filename = secure_filename(filename)
    return send_from_directory('D:\Torrents\[PACK] Elemar JR', filename)

if __name__ == '__main__':
    app.run(debug=True, port=8000)
