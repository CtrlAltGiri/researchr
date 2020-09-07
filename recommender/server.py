import argparse
import json
import os

import scorer
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from waitress import serve
from datetime import datetime
import filters

app = Flask(__name__)
load_dotenv()

app.config['MONGO_URI'] = os.getenv("DB_URL")

mainDB = PyMongo(app)
# number of projects to recommend in one response
NUM_REC = 50

class JSONEncoder(json.JSONEncoder):
    """
    Json encoder to encode ObjectId
    """

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        elif isinstance(o, datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)


def error_handler(err_type: str, message: str, status_code: int = 500):
    """
    Function to return error response
    :param err_type: Error type
    :param message: Error message
    :param status_code: Status code of response
    :return: response, status code
    """
    success = False
    response = {
        'success': success,
        'error': {
            'type': err_type,
            'message': message
        }
    }
    return jsonify(response), status_code


@app.route('/recommender/', methods=['POST'])
def recommender():
    if request.method == 'POST':
        data = request.get_json()
        #print(data)
        if 'student_id' not in data:
            return error_handler("InvalidRequest", "No student_id in request")
        # students collection in main
        students = mainDB.db.students
        try:
            # find student with specified student_id
            cur_student = students.find_one({'_id': ObjectId(data['student_id'])})
        except Exception as e:
            return error_handler("StudentFindError", str(e))

        # if no student is found or the student is not active
        if not cur_student or not cur_student['active']:
            return error_handler("StudentNotFound", "Invalid student_id")

        # get all interest tags and work exp. tags of the specified student
        # TODO(aditya): Get interest and work exp. tags from main students collection
        interest_tags = {'A', 'B', 'C'}  # dummy
        work_exp_tags = {'G', 'H', 'A'}  # dummy
        all_tags = interest_tags.union(work_exp_tags)

        # query
        query = {'tags': {'$in': list(all_tags)}}
        # filters
        if 'filters' in data:
            # call the make filters function that return the filter query based on the request data
            query.update(filters.make_filters(data))

        # get all projects from profProjects collection that have at least one tag which is in all_tags and based on other filters
        projects = mainDB.db.profProjects.find(query)
        # get list of projects sorted according to recommendation
        recommended_projects, total_num_projects = scorer.recommend(projects, interest_tags, work_exp_tags)
        # get page index from request and send projects wrt that
        cur_index = int(data.get('page_index', 0))
        recommended_projects = recommended_projects[cur_index * NUM_REC:(cur_index + 1) * NUM_REC]
        num_projects = len(recommended_projects)
        # return appropriate response
        status_code = 200
        success = True
        response = {
            "success": success,
            "student_id": cur_student['_id'],
            "projects": recommended_projects,
            "num_projects": num_projects
        }
        return JSONEncoder().encode(response), status_code


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Argument parser for recommender system server")
    parser.add_argument('--host', action="store", dest="host", type=str, required=False, default='localhost')
    parser.add_argument('-p', '--port', action="store", dest="port", type=int, required=False, default=5000)

    args = parser.parse_args()
    host = args.host
    port = args.port

    serve(app, host=host, port=port)
