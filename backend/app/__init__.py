from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import config

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins=app.config['CORS_ORIGINS'])

    # Register blueprints
    from app.routes.tickets import tickets_bp
    from app.routes.auth import auth_bp

    app.register_blueprint(tickets_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')

    return app