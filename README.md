# NLP Emotion Classifier

A small full-stack project that detects emotions from text using a machine learning model and a React frontend.

## Overview

This project combines:
- a Python Flask API for model inference
- a trained NLP model for emotion classification
- a Vite + React frontend for user interaction

The app analyzes text such as sentences or short messages and predicts one of the supported emotions.

## Supported emotions

- Joy
- Sadness
- Anger
- Fear
- Love
- Surprise

## Project structure

```text
NLP_ML/
├── backend/
│   └── app.py
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── model.py
├── train.txt
├── models/
├── README.md
└── .gitignore
```

## Prerequisites

- Python 3.9+
- Node.js 18+
- pip
- npm

## Setup

### 1. Install Python dependencies

```bash
pip install flask flask-cors joblib scikit-learn pandas numpy nltk
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Train or use the existing model

The project already includes trained model files under the `models/` folder, so you can usually run it without retraining.

If needed, you can retrain the model with:

```bash
python model.py
```

## Run the app

### Start the backend

```bash
cd backend
python app.py
```

The Flask API will run on:

```text
http://localhost:5000
```

### Start the frontend

```bash
cd frontend
npm run dev -- --host 0.0.0.0 --port 4173
```

Then open:

```text
http://localhost:4173
```

## API example

Send a POST request to `/predict` with JSON data:

```json
{
  "text": "I feel very happy and grateful today."
}
```

Example response:

```json
{
  "emotion": "joy"
}
```

## Notes

- The backend uses TF-IDF text features and a logistic regression classifier.
- CORS is enabled so the frontend can communicate with the Flask API.
- The model is trained from the dataset in `train.txt`.

## License

This project is for educational and personal use.
