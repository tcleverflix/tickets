import os
from app import create_app

# Determine environment (default to development if not set)
env = os.environ.get('FLASK_ENV', 'development')

# Create the Flask application for Gunicorn
app = create_app(env)