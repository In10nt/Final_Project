"""
AI Model Training Web UI
A beautiful web interface to train your AI model - perfect for demos!
"""

from flask import Flask, render_template, jsonify, request, send_file
from flask_cors import CORS
import json
import os
import time
import threading
from datetime import datetime
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle

app = Flask(__name__)
CORS(app)

# Global variable to track training progress
training_status = {
    'is_training': False,
    'progress': 0,
    'stage': 'idle',
    'message': 'Ready to train',
    'results': None
}


@app.route('/')
def index():
    """Serve the training UI"""
    return render_template('training_ui.html')


@app.route('/api/status')
def get_status():
    """Get current training status"""
    return jsonify(training_status)


@app.route('/api/model-info')
def get_model_info():
    """Get information about the current trained model"""
    model_path = 'models/size_recommender.pkl'
    
    if not os.path.exists(model_path):
        return jsonify({'exists': False})
    
    try:
        # Get file info
        file_stats = os.stat(model_path)
        file_size_mb = file_stats.st_size / (1024 * 1024)
        created_time = datetime.fromtimestamp(file_stats.st_ctime)
        modified_time = datetime.fromtimestamp(file_stats.st_mtime)
        
        # Load model
        with open(model_path, 'rb') as f:
            model_data = pickle.load(f)
        
        model = model_data['model']
        accuracy = model_data.get('accuracy', 0)
        
        # Get training data info
        training_samples = 0
        if os.path.exists('training_data_size.json'):
            with open('training_data_size.json', 'r') as f:
                training_data = json.load(f)
                training_samples = len(training_data)
        
        return jsonify({
            'exists': True,
            'file_size_mb': round(file_size_mb, 2),
            'created': created_time.strftime('%Y-%m-%d %H:%M:%S'),
            'modified': modified_time.strftime('%Y-%m-%d %H:%M:%S'),
            'accuracy': round(accuracy * 100, 2),
            'n_estimators': model.n_estimators,
            'max_depth': model.max_depth,
            'training_samples': training_samples,
            'feature_importance': {
                'Chest': round(model.feature_importances_[0] * 100, 1),
                'Waist': round(model.feature_importances_[1] * 100, 1),
                'Hip': round(model.feature_importances_[2] * 100, 1),
                'Height': round(model.feature_importances_[3] * 100, 1)
            }
        })
    except Exception as e:
        return jsonify({'exists': True, 'error': str(e)})


@app.route('/api/training-history')
def get_training_history():
    """Get training history"""
    history_file = 'training_history.json'
    
    if not os.path.exists(history_file):
        return jsonify({'history': []})
    
    try:
        with open(history_file, 'r') as f:
            history = json.load(f)
        return jsonify({'history': history})
    except Exception as e:
        return jsonify({'history': [], 'error': str(e)})


@app.route('/api/training-data')
def get_training_data():
    """Get current training data"""
    if not os.path.exists('training_data_size.json'):
        return jsonify({'samples': [], 'count': 0})
    
    try:
        with open('training_data_size.json', 'r') as f:
            data = json.load(f)
        return jsonify({'samples': data, 'count': len(data)})  # Return all samples
    except Exception as e:
        return jsonify({'samples': [], 'count': 0, 'error': str(e)})


@app.route('/api/upload-dataset', methods=['POST'])
def upload_dataset():
    """Upload dataset from CSV or JSON file"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Read file content
        content = file.read().decode('utf-8')
        
        # Load existing data
        if os.path.exists('training_data_size.json'):
            with open('training_data_size.json', 'r') as f:
                training_data = json.load(f)
        else:
            training_data = []
        
        added_count = 0
        added_samples = []
        
        # Parse based on file type
        if file.filename.endswith('.json'):
            # JSON format
            new_data = json.loads(content)
            if isinstance(new_data, list):
                for item in new_data:
                    if validate_sample(item):
                        training_data.append(item)
                        added_samples.append(item)
                        added_count += 1
            else:
                return jsonify({'error': 'JSON must be an array of samples'}), 400
                
        elif file.filename.endswith('.csv'):
            # CSV format
            import csv
            import io
            
            csv_file = io.StringIO(content)
            reader = csv.DictReader(csv_file)
            
            for row in reader:
                try:
                    sample = {
                        'measurements': {
                            'chest_cm': float(row.get('chest', row.get('chest_cm', 0))),
                            'waist_cm': float(row.get('waist', row.get('waist_cm', 0))),
                            'hip_cm': float(row.get('hip', row.get('hip_cm', 0))),
                            'height_cm': float(row.get('height', row.get('height_cm', 0)))
                        },
                        'actual_size': row.get('size', row.get('actual_size', '')),
                        'gender': row.get('gender', ''),
                        'clothing_type': row.get('clothing_type', 'shirt')
                    }
                    
                    if validate_sample(sample):
                        training_data.append(sample)
                        added_samples.append(sample)
                        added_count += 1
                except Exception as e:
                    continue  # Skip invalid rows
        else:
            return jsonify({'error': 'Unsupported file format. Use .json or .csv'}), 400
        
        # Save updated data
        with open('training_data_size.json', 'w') as f:
            json.dump(training_data, f, indent=2)
        
        return jsonify({
            'message': f'Successfully uploaded {added_count} samples',
            'total_samples': len(training_data),
            'added_count': added_count,
            'preview_samples': added_samples[:5]  # Return first 5 for preview
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def validate_sample(sample):
    """Validate a training sample"""
    try:
        if 'measurements' not in sample:
            return False
        
        measurements = sample['measurements']
        required_measurements = ['chest_cm', 'waist_cm', 'hip_cm', 'height_cm']
        
        for measure in required_measurements:
            if measure not in measurements or measurements[measure] <= 0:
                return False
        
        if 'actual_size' not in sample or sample['actual_size'] not in ['XS', 'S', 'M', 'L', 'XL', 'XXL']:
            return False
        
        if 'gender' not in sample or sample['gender'] not in ['female', 'male']:
            return False
        
        return True
    except:
        return False


@app.route('/api/download-template/<format>')
def download_template(format):
    """Download sample template file"""
    if format == 'csv':
        csv_content = """chest,waist,hip,height,size,gender,clothing_type
88.0,72.0,95.0,165.0,M,female,shirt
92.0,76.0,98.0,170.0,M,female,shirt
100.0,86.0,102.0,178.0,L,male,shirt
"""
        return csv_content, 200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=training_data_template.csv'
        }
    
    elif format == 'json':
        json_content = [
            {
                "measurements": {
                    "chest_cm": 88.0,
                    "waist_cm": 72.0,
                    "hip_cm": 95.0,
                    "height_cm": 165.0
                },
                "actual_size": "M",
                "gender": "female",
                "clothing_type": "shirt"
            },
            {
                "measurements": {
                    "chest_cm": 92.0,
                    "waist_cm": 76.0,
                    "hip_cm": 98.0,
                    "height_cm": 170.0
                },
                "actual_size": "M",
                "gender": "female",
                "clothing_type": "shirt"
            }
        ]
        return jsonify(json_content), 200, {
            'Content-Disposition': 'attachment; filename=training_data_template.json'
        }
    
    return jsonify({'error': 'Invalid format'}), 400


@app.route('/api/add-sample', methods=['POST'])
def add_sample():
    """Add a single training sample"""
    try:
        sample = request.json
        
        # Validate sample
        required_fields = ['chest_cm', 'waist_cm', 'hip_cm', 'height_cm', 'actual_size', 'gender']
        for field in required_fields:
            if field not in sample:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        # Load existing data
        if os.path.exists('training_data_size.json'):
            with open('training_data_size.json', 'r') as f:
                training_data = json.load(f)
        else:
            training_data = []
        
        # Add new sample
        new_sample = {
            'measurements': {
                'chest_cm': float(sample['chest_cm']),
                'waist_cm': float(sample['waist_cm']),
                'hip_cm': float(sample['hip_cm']),
                'height_cm': float(sample['height_cm'])
            },
            'actual_size': sample['actual_size'],
            'gender': sample['gender'],
            'clothing_type': sample.get('clothing_type', 'shirt')
        }
        
        training_data.append(new_sample)
        
        # Save
        with open('training_data_size.json', 'w') as f:
            json.dump(training_data, f, indent=2)
        
        return jsonify({'message': 'Sample added successfully', 'total_samples': len(training_data)})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/clear-data', methods=['POST'])
def clear_data():
    """Clear all training data"""
    try:
        if os.path.exists('training_data_size.json'):
            os.remove('training_data_size.json')
        return jsonify({'message': 'Training data cleared'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/train', methods=['POST'])
def start_training():
    """Start model training"""
    global training_status
    
    if training_status['is_training']:
        return jsonify({'error': 'Training already in progress'}), 400
    
    # Get parameters
    params = request.json
    num_samples = params.get('num_samples', 2000)
    n_estimators = params.get('n_estimators', 100)
    max_depth = params.get('max_depth', 10)
    use_existing_data = params.get('use_existing_data', False)
    
    # Start training in background thread
    thread = threading.Thread(
        target=train_model_background,
        args=(num_samples, n_estimators, max_depth, use_existing_data)
    )
    thread.start()
    
    return jsonify({'message': 'Training started'})


def train_model_background(num_samples, n_estimators, max_depth, use_existing_data=False):
    """Train model in background"""
    global training_status
    
    try:
        training_status['is_training'] = True
        training_status['progress'] = 0
        training_status['results'] = None
        
        # Stage 1: Generate or load data
        if use_existing_data and os.path.exists('training_data_size.json'):
            training_status['stage'] = 'loading_data'
            training_status['message'] = 'Loading existing training data...'
            training_status['progress'] = 10
            
            with open('training_data_size.json', 'r') as f:
                training_data = json.load(f)
            
            training_status['message'] = f'Loaded {len(training_data)} existing samples'
        else:
            training_status['stage'] = 'generating_data'
            training_status['message'] = f'Generating {num_samples} training samples...'
            training_status['progress'] = 10
            
            training_data = generate_training_data(num_samples)
            
            with open('training_data_size.json', 'w') as f:
                json.dump(training_data, f, indent=2)
        
        time.sleep(0.5)  # Let UI update
        
        # Stage 2: Prepare data
        training_status['stage'] = 'preparing_data'
        training_status['message'] = 'Preparing features and labels...'
        training_status['progress'] = 30
        
        X, y, size_labels = prepare_data(training_data)
        
        time.sleep(0.5)
        
        # Stage 3: Split data
        training_status['stage'] = 'splitting_data'
        training_status['message'] = 'Splitting into train/test sets...'
        training_status['progress'] = 40
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Stage 4: Scale features
        training_status['stage'] = 'scaling_features'
        training_status['message'] = 'Scaling features...'
        training_status['progress'] = 50
        
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        time.sleep(0.5)
        
        # Stage 5: Train model
        training_status['stage'] = 'training_model'
        training_status['message'] = f'Training Random Forest ({n_estimators} trees)...'
        training_status['progress'] = 60
        
        start_time = time.time()
        
        model = RandomForestClassifier(
            n_estimators=n_estimators,
            max_depth=max_depth if max_depth > 0 else None,
            min_samples_split=5,
            random_state=42
        )
        
        model.fit(X_train_scaled, y_train)
        
        duration = time.time() - start_time
        
        # Stage 6: Evaluate
        training_status['stage'] = 'evaluating'
        training_status['message'] = 'Evaluating model performance...'
        training_status['progress'] = 80
        
        train_predictions = model.predict(X_train_scaled)
        train_accuracy = accuracy_score(y_train, train_predictions)
        
        test_predictions = model.predict(X_test_scaled)
        test_accuracy = accuracy_score(y_test, test_predictions)
        
        # Get confusion matrix
        cm = confusion_matrix(y_test, test_predictions)
        
        # Get classification report
        report = classification_report(
            y_test, test_predictions,
            target_names=[size_labels[i] for i in sorted(set(y_test))],
            output_dict=True,
            zero_division=0
        )
        
        time.sleep(0.5)
        
        # Stage 7: Save model
        training_status['stage'] = 'saving_model'
        training_status['message'] = 'Saving trained model...'
        training_status['progress'] = 90
        
        os.makedirs('models', exist_ok=True)
        
        model_data = {
            'model': model,
            'scaler': scaler,
            'size_labels': size_labels,
            'accuracy': test_accuracy,
            'trained_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'algorithm': 'Random Forest Classifier',
            'n_estimators': n_estimators,
            'max_depth': max_depth
        }
        
        with open('models/size_recommender.pkl', 'wb') as f:
            pickle.dump(model_data, f)
        
        # Save training history
        save_training_history(len(X_train), train_accuracy, test_accuracy, duration)
        
        # Prepare results
        results = {
            'training_samples': len(X_train),
            'testing_samples': len(X_test),
            'train_accuracy': round(train_accuracy * 100, 2),
            'test_accuracy': round(test_accuracy * 100, 2),
            'duration': round(duration, 2),
            'confusion_matrix': cm.tolist(),
            'classification_report': report,
            'feature_importance': {
                'Chest': round(model.feature_importances_[0] * 100, 1),
                'Waist': round(model.feature_importances_[1] * 100, 1),
                'Hip': round(model.feature_importances_[2] * 100, 1),
                'Height': round(model.feature_importances_[3] * 100, 1)
            },
            'size_labels': size_labels
        }
        
        # Complete
        training_status['stage'] = 'complete'
        training_status['message'] = f'Training complete! Accuracy: {test_accuracy*100:.2f}%'
        training_status['progress'] = 100
        training_status['results'] = results
        
    except Exception as e:
        training_status['stage'] = 'error'
        training_status['message'] = f'Error: {str(e)}'
        training_status['progress'] = 0
    
    finally:
        training_status['is_training'] = False


def generate_training_data(num_samples):
    """Generate synthetic training data"""
    training_data = []
    
    female_sizes = {
        'XS': {'chest': (78, 82), 'waist': (60, 64), 'hip': (86, 90), 'height': (155, 165)},
        'S':  {'chest': (82, 88), 'waist': (64, 70), 'hip': (90, 96), 'height': (160, 170)},
        'M':  {'chest': (88, 94), 'waist': (70, 76), 'hip': (96, 102), 'height': (165, 175)},
        'L':  {'chest': (94, 100), 'waist': (76, 82), 'hip': (102, 108), 'height': (165, 175)},
        'XL': {'chest': (100, 108), 'waist': (82, 90), 'hip': (108, 116), 'height': (165, 180)},
        'XXL': {'chest': (108, 116), 'waist': (90, 98), 'hip': (116, 124), 'height': (165, 180)}
    }
    
    male_sizes = {
        'S':  {'chest': (86, 92), 'waist': (72, 78), 'hip': (90, 96), 'height': (165, 175)},
        'M':  {'chest': (92, 100), 'waist': (78, 86), 'hip': (96, 102), 'height': (170, 180)},
        'L':  {'chest': (100, 108), 'waist': (86, 94), 'hip': (102, 108), 'height': (175, 185)},
        'XL': {'chest': (108, 116), 'waist': (94, 102), 'hip': (108, 114), 'height': (175, 190)},
        'XXL': {'chest': (116, 124), 'waist': (102, 110), 'hip': (114, 120), 'height': (175, 195)}
    }
    
    clothing_types = ['shirt', 'pants', 'dress', 'jacket']
    
    for i in range(num_samples):
        gender = np.random.choice(['female', 'male'])
        sizes = female_sizes if gender == 'female' else male_sizes
        size = np.random.choice(list(sizes.keys()))
        size_ranges = sizes[size]
        
        chest = round(np.random.uniform(size_ranges['chest'][0], size_ranges['chest'][1]) + np.random.normal(0, 2), 1)
        waist = round(np.random.uniform(size_ranges['waist'][0], size_ranges['waist'][1]) + np.random.normal(0, 2), 1)
        hip = round(np.random.uniform(size_ranges['hip'][0], size_ranges['hip'][1]) + np.random.normal(0, 2), 1)
        height = round(np.random.uniform(size_ranges['height'][0], size_ranges['height'][1]) + np.random.normal(0, 3), 1)
        
        clothing_type = np.random.choice(clothing_types)
        
        sample = {
            'measurements': {
                'chest_cm': chest,
                'waist_cm': waist,
                'hip_cm': hip,
                'height_cm': height
            },
            'actual_size': size,
            'gender': gender,
            'clothing_type': clothing_type
        }
        
        training_data.append(sample)
    
    return training_data


def prepare_data(training_data):
    """Prepare data for training"""
    X = []
    y = []
    size_labels = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    
    for sample in training_data:
        measurements = sample['measurements']
        features = [
            measurements['chest_cm'],
            measurements['waist_cm'],
            measurements['hip_cm'],
            measurements['height_cm']
        ]
        X.append(features)
        
        size = sample['actual_size']
        if size in size_labels:
            y.append(size_labels.index(size))
    
    return np.array(X), np.array(y), size_labels


def save_training_history(training_samples, training_accuracy, testing_accuracy, duration):
    """Save training session to history"""
    history_file = 'training_history.json'
    
    if os.path.exists(history_file):
        with open(history_file, 'r') as f:
            history = json.load(f)
    else:
        history = []
    
    record = {
        'session': len(history) + 1,
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'training_samples': training_samples,
        'training_accuracy': round(training_accuracy * 100, 2),
        'testing_accuracy': round(testing_accuracy * 100, 2),
        'duration': round(duration, 2)
    }
    
    history.append(record)
    
    with open(history_file, 'w') as f:
        json.dump(history, f, indent=2)


if __name__ == '__main__':
    print("\n" + "=" * 70)
    print("🎓 AI Model Training Web UI")
    print("=" * 70)
    print("\nStarting training interface...")
    print("\n📱 Open in browser: http://localhost:5001")
    print("\n✨ Features:")
    print("  - Visual training interface")
    print("  - Real-time progress tracking")
    print("  - Model information dashboard")
    print("  - Training history viewer")
    print("  - Perfect for demonstrations!")
    print("\n" + "=" * 70)
    print()
    
    app.run(host='0.0.0.0', port=5001, debug=False)
