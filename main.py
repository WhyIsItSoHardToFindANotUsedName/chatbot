from flask import Flask, render_template, request, jsonify
import google.generativeai as genai  # Correct import
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()  # Load variables from .env
genai.configure(api_key=os.getenv("GOOGLE_API_KEY")) # Set your API in env file
model = genai.GenerativeModel("gemini-2.0-flash")
chat = model.start_chat()

app = Flask(__name__, template_folder="Frontend")
CORS(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat_endpoint():
    user_input = request.json.get("message")
    if not user_input:
        return jsonify({"error": "Empty input"}), 400
    else:
        response_text = chatbot_response(user_input)
        return jsonify({"response": response_text})
    


def chatbot_response(user_input):
    """
    Generates a response using the Gemini 2.0 Flash model.
    """
    # Configuration for response generation
    config = genai.GenerationConfig(
        temperature=1,
        top_p=0.95,
        top_k=40,
        max_output_tokens=8192,
    )

    # Generating response
    response = chat.send_message(user_input)

    return response.text  # Returning AI response

if __name__ == "__main__":
    app.run(debug=True)