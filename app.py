from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, origins="*")

TOTAL_HOLES = 7

@app.route('/start', methods=['GET'])
def start_game():
    secret = random.randint(1, TOTAL_HOLES)
    return jsonify({
        "total_holes": TOTAL_HOLES,
        "secret": secret,
        "message": "The golden acorn is hidden somewhere on the Quad!"
    })

@app.route('/guess', methods=['POST'])
def guess():
    data = request.json
    hole = int(data.get('hole'))
    secret = int(data.get('secret'))
    low = int(data.get('low', 1))
    high = int(data.get('high', TOTAL_HOLES))
    steps = int(data.get('steps', 0)) + 1
    optimal_pick = (low + high) // 2
    optimal = (hole == optimal_pick)

    if hole == secret:
        return jsonify({"result": "found", "steps": steps, "optimal": optimal, "optimal_pick": optimal_pick})
    elif hole < secret:
        return jsonify({"result": "higher", "steps": steps, "optimal": optimal, "optimal_pick": optimal_pick, "new_low": hole + 1, "new_high": high})
    else:
        return jsonify({"result": "lower", "steps": steps, "optimal": optimal, "optimal_pick": optimal_pick, "new_low": low, "new_high": hole - 1})

if __name__ == '__main__':
    app.run(debug=True, port=8080)