from flask import Flask, render_template, jsonify
import json
import random

app = Flask(__name__)

# Load quotes from JSON file
def load_quotes():
    with open('data/quotes.json', 'r') as file:
        return json.load(file)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/random-quote')
def random_quote():
    quotes = load_quotes()
    quote = random.choice(quotes)
    return jsonify(quote)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
