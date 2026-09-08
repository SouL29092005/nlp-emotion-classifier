import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import nltk
import os

os.makedirs('models', exist_ok=True)


from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

from sklearn.model_selection import train_test_split

from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score

from sklearn.linear_model import LogisticRegression
     

df = pd.read_csv('train.txt',sep = ';',header = None,names = ['text','emotion'])

df.head()

df.isnull().sum()

unique_emotions = df['emotion'].unique()
emotion_numbers = {}
i = 0
for emo in unique_emotions:
  emotion_numbers[emo] = i
  i +=1

df['emotion'] = df['emotion'].map(emotion_numbers)

df

df['text'] = df['text'].apply(lambda x : x.lower())


import string

def remove_punc(txt):
    return txt.translate(str.maketrans('','',string.punctuation))

df['text'] = df['text'].apply(remove_punc)


def remove_numbers(txt):
    new = ""
    for i in txt:
        if not i.isdigit():
            new = new + i
    return new

df['text'] = df['text'].apply(remove_numbers)

def remove_emojis(txt):
    new = ""
    for i in txt:
        if i.isascii():
            new += i
    return new

df['text'] = df['text'].apply(remove_emojis)



nltk.download('punkt')
nltk.download('stopwords')

stop_words = set(stopwords.words('english'))

df.loc[1]['text']
def remove(txt):
  words = txt.split()
  cleaned = []
  for i in words:
    if not i in stop_words:
      cleaned.append(i)

  return ' '.join(cleaned)

df['text'] = df['text'].apply(remove)
df.loc[1]['text']

df.head()

X_train, X_test, y_train, y_test = train_test_split(
    df['text'],
    df['emotion'],
    test_size=0.20,
    random_state=42,
    stratify=df['emotion']
)

bow_vectorizer = CountVectorizer()
X_train_bow = bow_vectorizer.fit_transform(X_train)
X_test_bow = bow_vectorizer.transform(X_test)


nb_model = MultinomialNB()
nb_model.fit(X_train_bow, y_train)


pred_bow = nb_model.predict(X_test_bow)
print(accuracy_score(y_test, pred_bow))

pred_bow

tfidf_vectorizer = TfidfVectorizer()
X_train_tfidf = tfidf_vectorizer.fit_transform(X_train)
X_test_tfidf = tfidf_vectorizer.transform(X_test)


nb2_model = MultinomialNB()
nb2_model.fit(X_train_tfidf,y_train)

y_pred = nb2_model.predict(X_test_tfidf)

print(accuracy_score(y_test, y_pred))

logistic_model = LogisticRegression(max_iter=1000)  
logistic_model.fit(X_train_tfidf,y_train)

log_pred = logistic_model.predict(X_test_tfidf)
print(accuracy_score(y_test,log_pred ))

import joblib

joblib.dump(tfidf_vectorizer, os.path.join('models', 'tfidf_vectorizer.pkl'))
joblib.dump(logistic_model, os.path.join('models', 'emotion_model.pkl'))
joblib.dump(emotion_numbers, os.path.join('models', 'emotion_encoder.pkl'))