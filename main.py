from flask import Flask, request, render_template, redirect, url_for
import smtplib
import os
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()


@app.route("/")
def home():
    return render_template('index.html')


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=False, host='0.0.0.0', port=port)
