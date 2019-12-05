from flask import Flask, request, jsonify, render_template, url_for
from search import search
from delete import delete
from tags_search import tags_search
from submit import submit
from init import init
from init import get_document
import os
import json
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)

def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path, endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)


@app.route("/")
@cross_origin()
def hello():
    return render_template('index.html')

@app.route("/search", methods=['POST'])
@cross_origin()
def search_ca():
    data = json.loads(request.form.get('data'))
    db_data = search(cur_category=data['tag'],cur_page=data['num'])
    return db_data

@app.route("/delete", methods=['POST'])
@cross_origin()
def delete_ca():
    data = json.loads(request.form.get('data'))
    delete_data = delete(text_id=data['text_id'])
    return delete_data

@app.route("/tags_search", methods=['POST'])
@cross_origin()
def tags_search_ca():
    data = json.loads(request.form.get('data'))
    print(data)
    tags_search_data = tags_search(cur_category=data['tag'],cur_page=data['num'])
    return tags_search_data

@app.route("/submit", methods=['POST'])
@cross_origin()
def submit_ca():
    data = json.loads(request.form.get('data'))
    submit_data = submit(category=data['tag'],tags=data['tags'],text_id=data['text_id'])
    return submit_data

@app.route("/init", methods=['GET'])
@cross_origin()
def init_ca():
    init_data = init()
    return jsonify(init_data)

@app.route("/get_document", methods=['GET'])
@cross_origin()
def get_document_ca():
    get_document_data = get_document()
    return get_document_data

if __name__ == "__main__":
    app.run(host="127.0.0.1",port=5000)