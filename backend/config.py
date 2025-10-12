import os
from urllib.parse import quote
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    # Prefer build from POSTGRES_* to correctly quote passwords and host
    _pg_user = os.environ.get('POSTGRES_USER')
    _pg_password = os.environ.get('POSTGRES_PASSWORD')
    _pg_db = os.environ.get('POSTGRES_DB')
    _pg_host = os.environ.get('POSTGRES_HOST', 'database')
    _pg_port = os.environ.get('POSTGRES_PORT', '5432')
    if _pg_user and _pg_password and _pg_db:
        SQLALCHEMY_DATABASE_URI = (
            f"postgresql://{_pg_user}:{quote(_pg_password, safe='')}@{_pg_host}:{_pg_port}/{_pg_db}"
        )
    else:
        SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///tickets.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # n8n Configuration
    N8N_BASE_URL = os.environ.get('N8N_BASE_URL', 'http://n8n:5678')
    N8N_WEBHOOK_NEW_TICKET = os.environ.get('N8N_WEBHOOK_NEW_TICKET', f'{N8N_BASE_URL}/webhook/nuevo-ticket')
    N8N_WEBHOOK_UPDATE_TICKET = os.environ.get('N8N_WEBHOOK_UPDATE_TICKET', f'{N8N_BASE_URL}/webhook/actualizar-ticket')
    N8N_WEBHOOK_CLOSE_TICKET = os.environ.get('N8N_WEBHOOK_CLOSE_TICKET', f'{N8N_BASE_URL}/webhook/cerrar-ticket')
    N8N_WEBHOOK_AGENT_ASSIGNMENT = os.environ.get('N8N_WEBHOOK_AGENT_ASSIGNMENT', f'{N8N_BASE_URL}/webhook/asignar-agente')

    # CORS Configuration
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')

class DevelopmentConfig(Config):
    DEBUG = True
    # Inherit computed URI from Config
    pass

class ProductionConfig(Config):
    DEBUG = False
    # Inherit computed URI from Config
    pass

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}