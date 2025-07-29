# Conversational AI backend for OpenAI API
from flask import Blueprint, request, jsonify
import os
import openai

chat_api = Blueprint('chat_api', __name__)

# Set your OpenAI API key here or via environment variable
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', 'sk-...')  # Replace with your key or set env var
openai.api_key = OPENAI_API_KEY

@chat_api.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    if not user_message:
        return jsonify({'reply': 'Please enter a message.'})
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful onboarding and sales assistant for a lead scoring dashboard. Answer questions, guide onboarding, and make recommendations."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=200,
            temperature=0.7
        )
        reply = response.choices[0].message['content'].strip()
        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'reply': f'Sorry, there was an error: {str(e)}'})
