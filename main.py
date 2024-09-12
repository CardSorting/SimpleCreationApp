from flask import Flask, render_template, jsonify, request
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

@app.route('/api/quotes')
def get_quotes():
    category = request.args.get('category')
    quotes = load_quotes()
    
    if category:
        filtered_quotes = [quote for quote in quotes if quote['category'] == category]
        return jsonify(filtered_quotes)
    else:
        return jsonify(quotes)

@app.route('/api/categories')
def get_categories():
    quotes = load_quotes()
    categories = list(set(quote['category'] for quote in quotes))
    return jsonify(categories)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
