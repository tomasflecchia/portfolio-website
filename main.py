from flask import Flask, request, render_template, redirect, url_for
import smtplib
import os
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()


@app.route("/")
def home():
    return render_template('index.html')


@app.route('/submit-form', methods=['POST'])
def submit_form():
    name = request.form.get('name')
    email = request.form.get('email')
    text = request.form.get('text')

    try:
        with smtplib.SMTP(os.environ["SMTP_SERVER"], port=587) as connection:
            connection.starttls()
            connection.login(os.environ["EMAIL_ADDRESS"], os.environ["EMAIL_PASSWORD"])
            connection.sendmail(
                from_addr=os.environ["EMAIL_ADDRESS"],
                to_addrs=os.environ["TO_EMAIL_ADDRESS"],
                msg=f"Subject: New Message from Website\n\n"
                    f"Name: {name}\n"
                    f"Email: {email}\n"
                    f"Message:\n{text}"
            )
    except Exception as e:
        print(f"Email error: {e}")
        return "Failed to send message", 500

    return redirect(url_for('home'))


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))  # use Render’s port if available
    app.run(debug=False, host='0.0.0.0', port=port)
