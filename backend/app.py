from flask import Flask, jsonify, request
from flask_mail import Mail, Message
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# --- Configure Mail Settings ---
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

mail = Mail(app)

@app.route('/')
def home():
    return jsonify({"status": "Server is running ✅"}), 200

@app.route('/form/data', methods=['POST'])
def form_data():
    try:
        data = request.form.to_dict()
        
        # Format email body
        email_body = f"""
        New Contact Form Submission

        Name: {data.get('name', 'Not provided')}
        Email: {data.get('email', 'Not provided')}
        Phone: {data.get('phone', 'Not provided')}
        Message: {data.get('message', 'Not provided')}
        """
        
        # Create email message
        msg = Message(
            subject='New Contact Form Submission - Hotel Shreegopal',
            sender=app.config['MAIL_USERNAME'],
            recipients=[os.getenv('RECEIVER_EMAIL')],
            body=email_body
        )

        # Send email
        mail.send(msg)

        return jsonify({
            "message": "Message sent successfully",
            "status": "success",
            "data": data
        }), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            "message": "Failed to send message",
            "status": "error",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
