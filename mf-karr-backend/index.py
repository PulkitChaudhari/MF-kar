from flask import Flask, jsonify, request
from flask_cors import CORS
from services.greeting_service import GreetingService

app = Flask(__name__)
CORS(app)

@app.route('/api/hello/<string:name>')
def hello(name):
    greeting_service = GreetingService()
    result = greeting_service.create_greeting(name)
    return jsonify(result)

@app.route('/api/users', methods=['GET'])
def get_users():
    # Placeholder data - replace with actual database query
    users = [
        {'id': 1, 'name': 'John Doe'},
        {'id': 2, 'name': 'Jane Smith'}
    ]
    return jsonify(users)

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    # Placeholder data - replace with actual database query
    user = {'id': user_id, 'name': 'John Doe'}
    return jsonify(user)

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    # Placeholder response - replace with actual database insertion
    return jsonify({
        'message': 'User created successfully',
        'user': data
    }), 201

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8081, debug=True)
