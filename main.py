from flask import Flask, render_template, jsonify, request
import json
import random

app = Flask(__name__)

# Load quotes from JSON file
def load_quotes():
    with open('data/quotes.json', 'r') as file:
        return json.load(file)

# In-memory storage for favorite quotes
favorite_quotes = []

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

@app.route('/api/favorite', methods=['POST'])
def add_favorite():
    quote = request.json
    if quote not in favorite_quotes:
        favorite_quotes.append(quote)
    return jsonify({"message": "Quote added to favorites"}), 201

@app.route('/api/favorite', methods=['DELETE'])
def remove_favorite():
    quote = request.json
    if quote in favorite_quotes:
        favorite_quotes.remove(quote)
    return jsonify({"message": "Quote removed from favorites"}), 200

@app.route('/api/favorites')
def get_favorites():
    return jsonify(favorite_quotes)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
