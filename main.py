from flask import Flask, render_template, jsonify, request, session
import json
import random
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Set a secret key for session management

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
    is_premium = session.get('is_premium', False)
    available_quotes = [q for q in quotes if not q['premium'] or is_premium]
    quote = random.choice(available_quotes)
    return jsonify(quote)

@app.route('/api/quotes')
def get_quotes():
    category = request.args.get('category')
    quotes = load_quotes()
    is_premium = session.get('is_premium', False)
    
    if category:
        filtered_quotes = [quote for quote in quotes if quote['category'] == category and (not quote['premium'] or is_premium)]
    else:
        filtered_quotes = [quote for quote in quotes if not quote['premium'] or is_premium]
    
    return jsonify(filtered_quotes)

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

@app.route('/api/toggle-premium', methods=['POST'])
def toggle_premium():
    session['is_premium'] = not session.get('is_premium', False)
    return jsonify({"is_premium": session['is_premium']})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
