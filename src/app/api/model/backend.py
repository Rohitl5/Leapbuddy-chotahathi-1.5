from flask import Flask, request, jsonify
from llama_cpp import Llama
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the Llama.cpp model
print("Loading model using Llama.cpp...")
model_path = "./src/app/api/model/tinyllama-1.1b-chat-v0.3.Q5_K_M.gguf"  # Adjust the path if needed
llm = Llama(model_path=model_path)
print("Model loaded.")

@app.route("/generate", methods=["POST"])
def generate():
    try:
        # Extract the prompt from the request
        data = request.json
        prompt = data.get("prompt")
        print("Received prompt:", prompt)  # Debugging
        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400

        # Generate the response using Llama.cpp
        result = llm(prompt, max_tokens=50, stop=["<|endoftext|>"], echo=False)

        # Extract the text response
        # response = result.get("choices", [{}])[0].get("text", "").strip()
        # print("Sending response:", response)  # Debugging
        # return jsonify({"response": response}), 200

        response = result.get("choices", [{}])[0].get("text", "").strip()
        # Clean the response by removing delimiters like <|im_start|> and <|im_end|>
        response = response.replace("<|im_start|>", "").replace("<|im_end|>", "").strip()
        print("Sending response:", response)  # Debugging
        return jsonify({"response": response}), 200




    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=8000)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)

# -----------=============-==--------------------====================--------------------==================
