from flask import Flask, request, jsonify
import csv
import os

app = Flask(__name__)

# Ensure the CSV file exists
csv_file_path = 'user_searches.csv'
if not os.path.exists(csv_file_path):
    with open(csv_file_path, mode='w') as file:
        writer = csv.writer(file)
        writer.writerow(['search_term'])

@app.route('/track_search', methods=['POST'])
def track_search():
    search_term = request.json.get('search_term')
    if search_term:
        with open(csv_file_path, mode='a') as file:
            writer = csv.writer(file)
            writer.writerow([search_term])
        return jsonify({'status': 'success'}), 200
    return jsonify({'status': 'error', 'message': 'No search term provided'}), 400

if __name__ == '__main__':
    app.run(debug=True)