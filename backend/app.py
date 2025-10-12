import os
from app import create_app, db
from app.models import Ticket, Comment, User

app = create_app(os.environ.get('FLASK_ENV', 'development'))

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Ticket': Ticket, 'Comment': Comment, 'User': User}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)