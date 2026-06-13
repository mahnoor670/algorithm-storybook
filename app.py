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

@app.route('/bubble-sort/swap', methods=['POST'])
def bubble_swap():
    data = request.json
    arr = data.get('arr')
    index1 = int(data.get('index1'))
    index2 = int(data.get('index2'))
    swaps = int(data.get('swaps', 0)) + 1
    
    needs_swap = arr[index1] > arr[index2]
    optimal = (abs(index1 - index2) == 1) and needs_swap
    
    arr[index1], arr[index2] = arr[index2], arr[index1]
    sorted_arr = arr == sorted(arr)
    
    return jsonify({
        "arr": arr,
        "swaps": swaps,
        "optimal": optimal,
        "sorted": sorted_arr
    })

@app.route('/selection-sort/pick', methods=['POST'])
def selection_pick():
    data = request.json
    arr = data.get('arr')
    picked_index = int(data.get('picked_index'))
    sorted_count = int(data.get('sorted_count'))
    steps = int(data.get('steps', 0)) + 1
    
    unsorted = arr[sorted_count:]
    min_val = min(unsorted)
    is_optimal = (arr[picked_index] == min_val)
    
    if is_optimal:
        arr[sorted_count], arr[picked_index] = arr[picked_index], arr[sorted_count]
        sorted_count += 1
    
    return jsonify({
        "arr": arr,
        "steps": steps,
        "optimal": is_optimal,
        "sorted_count": sorted_count,
        "min_val": min_val,
        "done": sorted_count == len(arr)
    })

if __name__ == '__main__':
    app.run(debug=True, port=8080)