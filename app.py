from flask import Flask, jsonify, request
from flask_mail import Mail, Message

app = Flask(__name__)

# --- Configure Mail Settings ---
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'mail@gmail.com'      # Replace with your email
app.config['MAIL_PASSWORD'] = 'your_app_password'          # Use App Password, NOT your real password

mail = Mail(app)

@app.route('/form/data', methods=['POST'])
def form_data():
    data = request.form.to_dict()
    
    # Create email message
    msg = Message(
        subject='New Form Submission',
        sender=app.config['MAIL_USERNAME'],
        recipients=['receiver_email@gmail.com'],   # Replace with the receiver email
        body=f"New form submission:\n\n{data}"
    )

    # Send email
    mail.send(msg)

    return jsonify({"message": "Data received and email sent successfully", "data": data}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)
