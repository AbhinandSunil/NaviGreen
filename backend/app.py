from flask import Flask, request, jsonify, render_template
import numpy as np
import tensorflow.lite as tflite
from flask_cors import CORS
from google.cloud import firestore
import google.auth
from datetime import datetime

credentials, project = google.auth.default()
db = firestore.Client(credentials=credentials, project=project)

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}})

interpreter = tflite.Interpreter(model_path='tflitemodel/transport_mode_model.tflite')
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

prediction_labels = {
    3: 'Standing',
    2: 'Walking',
    0: 'Bus',
    1: 'Biking'
}

@app.route('/predict', methods=['POST'])
def predict():
    if not request.json or 'user_id' not in request.json or 'data' not in request.json:
        return jsonify({'error': 'Missing data in request'}),
    
    user_id = request.json['user_id']
    input_data = request.json['data']
    print("Received input data:", input_data)
    input_data = np.array(input_data, dtype=np.float32).reshape(1, 11, 1)
    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])
    prediction = np.argmax(output_data)
    prediction_label = prediction_labels[prediction]
    current_day = datetime.now().strftime('%A')
    user_doc_ref = db.collection('users').document(user_id)
    user_doc = user_doc_ref.get()
    
    if not user_doc.exists:
        return jsonify({'error': 'User not found'}), 404

    user_data = user_doc.to_dict()
    user_predictions = user_data.setdefault('predictions', {})
    user_predictions.setdefault(current_day, {'ecos': 0, 'predictions': []})
    user_day_data = user_predictions[current_day]
    user_day_data['predictions'].append(prediction_label)

    ecos_increment = 0  
    if len(user_day_data['predictions']) % 10 == 0:
        ecos_increment = {
            'Walking': 3,
            'Bus': 1,
            'Biking': 2,
            'Standing': 0
        }.get(prediction_label, 0)

    user_day_data['ecos'] += ecos_increment
    user_doc_ref.set(user_data, merge=True)
    return jsonify({'prediction': prediction_label, 'current_day_ecos': user_day_data['ecos']})

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
