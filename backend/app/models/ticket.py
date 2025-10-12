from datetime import datetime
from app import db

class Ticket(db.Model):
    __tablename__ = 'tickets'

    id = db.Column(db.Integer, primary_key=True)
    client_name = db.Column(db.String(255), nullable=False)
    client_email = db.Column(db.String(255), nullable=False)
    subject = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum('abierto', 'en_proceso', 'cerrado', name='ticket_status'), default='abierto')
    priority = db.Column(db.Enum('baja', 'media', 'alta', 'critica', name='ticket_priority'), default='media')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    assigned_to_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    category = db.Column(db.String(100))
    client_phone = db.Column(db.String(20))
    department = db.Column(db.String(100))

    # Relationship with comments
    comments = db.relationship('Comment', backref='ticket', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        assigned_user_data = None
        if self.assigned_user:
            assigned_user_data = {
                'id': self.assigned_user.id,
                'username': self.assigned_user.username,
                'full_name': self.assigned_user.full_name,
                'email': self.assigned_user.email
            }

        return {
            'id': self.id,
            'client_name': self.client_name,
            'client_email': self.client_email,
            'client_phone': self.client_phone,
            'subject': self.subject,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'assigned_to_id': self.assigned_to_id,
            'assigned_to': assigned_user_data,
            'category': self.category,
            'department': self.department,
            'comments': [comment.to_dict() for comment in self.comments]
        }

    def __repr__(self):
        return f'<Ticket {self.id}: {self.subject}>'