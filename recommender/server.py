import argparse
import json

import scorer
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from waitress import serve

app = Flask(__name__)

#TODO(aditya): Get this url from env file
app.config['MONGO_URI'] = 'mongodb://localhost:27017/main'

mainDB = PyMongo(app)


class JSONEncoder(json.JSONEncoder):
    """
    Json encoder to encode ObjectId
    """
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


@app.route('/recommender/', methods = ['POST'])
def recommender():
   if request.method == 'POST':
       data = request.get_json()
       print(data)
       users = mainDB.db.users
       cur_user = users.find_one({'_id': ObjectId(data['user_id'])})
       # if no user is found or the user is not active
       if not cur_user or not cur_user['active']:
           status_code = 500
           success = False
           response = {
               'success': success,
               'error': {
                   'type': "UserNotFound",
                   'message': "Invalid user id"
               }
           }
           return jsonify(response), status_code
       # get all interest tags and work exp. tags of the specified user
       #TODO(aditya): Get interest and work exp. tags from userDB users collection
       interest_tags = {'A', 'B', 'C'} #dummy
       work_exp_tags = {'G', 'H', 'A'} #dummy
       all_tags = interest_tags.union(work_exp_tags)
       # get all projects from projectsDB that have atleat one tag which is in all_tags
       projects = mainDB.db.profProjects.find({'tags': {'$in':  list(all_tags)}})

       # get list of projects sorted according to recommendation
       recommended_projects, num_projects = scorer.recommend(projects, interest_tags, work_exp_tags)
       # return appropriate response
       status_code = 200
       success = True
       response = {
           "success": success,
           "email": cur_user['email'],
           "user_id": cur_user['_id'],
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
    # app.run(host=host, port=port)
