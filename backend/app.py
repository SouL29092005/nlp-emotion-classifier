from flask import Flask, request, jsonify
from flask_cors import CORS

import joblib
import string


app = Flask(__name__)
CORS(app)


tfidf_vectorizer = joblib.load('../models/tfidf_vectorizer.pkl')
emotion_model = joblib.load('../models/emotion_model.pkl')
emotion_numbers = joblib.load('../models/emotion_encoder.pkl')


reverse_emotion_numbers = {
    value: key for key, value in emotion_numbers.items()
}


from nltk.corpus import stopwords

stop_words = set(stopwords.words('english'))


def remove_punc(txt):
    return txt.translate(
        str.maketrans('', '', string.punctuation)
    )


def remove_numbers(txt):
    new = ""

    for i in txt:
        if not i.isdigit():
            new = new + i

    return new


def remove_emojis(txt):
    new = ""

    for i in txt:
        if i.isascii():
            new += i

    return new


def remove(txt):
    words = txt.split()

    cleaned = []

    for i in words:
        if i not in stop_words:
            cleaned.append(i)

    return ' '.join(cleaned)


def preprocess_text(txt):

    txt = txt.lower()

    txt = remove_punc(txt)

    txt = remove_numbers(txt)

    txt = remove_emojis(txt)

    txt = remove(txt)

    return txt


@app.route('/predict', methods=['POST'])
def predict():

    data = request.get_json()

    if not data or 'text' not in data:
        return jsonify({
            'error': 'Text is required'
        }), 400

    text = data['text']

    cleaned_text = preprocess_text(text)

    text_tfidf = tfidf_vectorizer.transform([cleaned_text])

    prediction = emotion_model.predict(text_tfidf)[0]

    emotion = reverse_emotion_numbers[prediction]

    return jsonify({
        'emotion': emotion
    })


if __name__ == '__main__':
    app.run(debug=True)