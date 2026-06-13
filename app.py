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

@app.route('/insertion-sort/insert', methods=['POST'])
def insertion_insert():
    data = request.json
    arr = data.get('arr')
    sorted_count = int(data.get('sorted_count'))
    insert_position = int(data.get('insert_position'))
    steps = int(data.get('steps', 0)) + 1
    
    current_book = arr[sorted_count]
    sorted_section = arr[:sorted_count]
    
    correct_position = sorted_count
    for i, val in enumerate(sorted_section):
        if current_book < val:
            correct_position = i
            break
    
    is_optimal = (insert_position == correct_position)
    
    if is_optimal:
        arr.pop(sorted_count)
        arr.insert(insert_position, current_book)
        sorted_count += 1
    
    return jsonify({
        "arr": arr,
        "steps": steps,
        "optimal": is_optimal,
        "sorted_count": sorted_count,
        "correct_position": correct_position,
        "done": sorted_count == len(arr)
    })


@app.route('/merge-sort/pick', methods=['POST'])
def merge_pick():
    data = request.json
    left = data.get('left')
    right = data.get('right')
    merged = data.get('merged')
    picked_side = data.get('picked_side')
    steps = int(data.get('steps', 0)) + 1

    if not left and not right:
        return jsonify({"error": "Both groups empty"}), 400

    if not left:
        correct_side = 'right'
        correct_value = right[0]
    elif not right:
        correct_side = 'left'
        correct_value = left[0]
    elif left[0] <= right[0]:
        correct_side = 'left'
        correct_value = left[0]
    else:
        correct_side = 'right'
        correct_value = right[0]

    is_optimal = (picked_side == correct_side)
    picked_value = left[0] if picked_side == 'left' else right[0]

    if is_optimal:
        merged.append(picked_value)
        if picked_side == 'left':
            left.pop(0)
        else:
            right.pop(0)

    done = len(left) == 0 and len(right) == 0

    return jsonify({
        "left": left,
        "right": right,
        "merged": merged,
        "steps": steps,
        "optimal": is_optimal,
        "picked_value": picked_value,
        "correct_value": correct_value,
        "done": done
    })

@app.route('/quick-sort/assign', methods=['POST'])
def quick_assign():
    data = request.json
    current_arr = data.get('current_arr')
    selected_index = int(data.get('selected_index'))
    side = data.get('side')
    left = data.get('left')
    right = data.get('right')
    pivot = data.get('pivot')
    placed_indices = data.get('placed_indices')
    queue = data.get('queue')
    sorted_positions = data.get('sorted_positions')
    steps = int(data.get('steps', 0)) + 1

    selected_val = current_arr[selected_index]
    correct_side = 'left' if selected_val < pivot else 'right'
    is_correct = (side == correct_side)

    if is_correct:
        if side == 'left':
            left.append(selected_val)
        else:
            right.append(selected_val)
        placed_indices.append(selected_index)

    all_placed = len(placed_indices) == len(current_arr) - 1
    done = False
    next_arr = current_arr
    next_pivot = pivot

    if all_placed:
        sorted_positions.append(pivot)
        next_candidates = []
        if len(left) > 1:
            next_candidates.append(left)
        elif len(left) == 1:
            sorted_positions.append(left[0])
        if len(right) > 1:
            next_candidates.append(right)
        elif len(right) == 1:
            sorted_positions.append(right[0])

        queue = queue + next_candidates[1:] if len(next_candidates) > 1 else queue
        if next_candidates:
            next_arr = next_candidates[0]
            next_pivot = next_arr[-1]
        elif queue:
            next_arr = queue.pop(0)
            next_pivot = next_arr[-1]
        else:
            done = True
            next_arr = []

    return jsonify({
        "left": left,
        "right": right,
        "placed_indices": placed_indices,
        "steps": steps,
        "correct": is_correct,
        "partition_complete": all_placed,
        "next_arr": next_arr,
        "next_pivot": next_pivot,
        "sorted_positions": sorted_positions,
        "queue": queue,
        "done": done
    })

if __name__ == '__main__':
    app.run(debug=True, port=8080)