from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import os

load_dotenv()
app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"status": "Server is running ✅"}), 200

@app.route('/form/data', methods=['POST'])
def form_data():
    try:
        data = request.form.to_dict()

        # Prepare email content
        email_html = f"""
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {data.get('name', 'Not provided')}</p>
        <p><strong>Email:</strong> {data.get('email', 'Not provided')}</p>
        <p><strong>Phone:</strong> {data.get('phone', 'Not provided')}</p>
        <p><strong>Message:</strong></p>
        <p>{data.get('message', 'Not provided')}</p>
        """

        # Send email via Resend API
        response = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {os.getenv('RESEND_API_KEY')}",
                "Content-Type": "application/json"
            },
            json={
                "from": "Hotel Shreegopal <onboarding@resend.dev>",
                "to": [os.getenv("RECEIVER_EMAIL")],
                "subject": "New Contact Form Submission - Hotel Shreegopal",
                "html": email_html
            }
        )

        if response.status_code == 200:
            return jsonify({
                "message": "Message sent successfully ✅",
                "status": "success",
                "data": data
            }), 200
        else:
            return jsonify({
                "message": "Failed to send email ❌",
                "status": "error",
                "details": response.text
            }), 500

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            "message": "Server error",
            "status": "error",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
