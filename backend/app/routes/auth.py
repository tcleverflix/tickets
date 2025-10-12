from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models.user import User
from functools import wraps
import jwt
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)

def token_required(f):
    """Decorator to protect routes requiring authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Get token from header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401

        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        try:
            # Decode token
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])

            if not current_user or not current_user.is_active:
                return jsonify({'error': 'Invalid token or user inactive'}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        # Pass current_user to the route
        return f(current_user, *args, **kwargs)

    return decorated

def admin_required(f):
    """Decorator to protect admin-only routes"""
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(current_user, *args, **kwargs)

    return decorated

@auth_bp.route('/auth/register', methods=['POST'])
def register():
    """Register a new user (admin only in production)"""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['username', 'email', 'password', 'full_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400

        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400

        # Create new user
        user = User(
            username=data['username'],
            email=data['email'],
            full_name=data['full_name'],
            role=data.get('role', 'agent')  # Default to agent
        )
        user.set_password(data['password'])

        db.session.add(user)
        db.session.commit()

        return jsonify({
            'message': 'User created successfully',
            'user': user.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """Login user and return JWT token"""
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username and password are required'}), 400

        # Find user
        user = User.query.filter_by(username=data['username']).first()

        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401

        if not user.is_active:
            return jsonify({'error': 'User account is inactive'}), 401

        # Generate JWT token
        token = jwt.encode({
            'user_id': user.id,
            'username': user.username,
            'role': user.role,
            'exp': datetime.utcnow() + timedelta(hours=24)  # Token expires in 24 hours
        }, current_app.config['SECRET_KEY'], algorithm="HS256")

        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """Get current logged-in user information"""
    return jsonify(current_user.to_dict()), 200

@auth_bp.route('/auth/users', methods=['GET'])
@token_required
@admin_required
def get_users(current_user):
    """Get all users (admin only)"""
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/auth/users/<int:user_id>', methods=['PUT'])
@token_required
@admin_required
def update_user(current_user, user_id):
    """Update user (admin only)"""
    try:
        user = User.query.get_or_404(user_id)
        data = request.get_json()

        # Update fields if provided
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'email' in data:
            # Check if email already exists
            existing = User.query.filter(User.email == data['email'], User.id != user_id).first()
            if existing:
                return jsonify({'error': 'Email already exists'}), 400
            user.email = data['email']
        if 'role' in data:
            user.role = data['role']
        if 'is_active' in data:
            user.is_active = data['is_active']
        if 'password' in data and data['password']:
            user.set_password(data['password'])

        user.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({
            'message': 'User updated successfully',
            'user': user.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/auth/agents', methods=['GET'])
@token_required
def get_agents(current_user):
    """Get all active agents (for ticket assignment)"""
    try:
        agents = User.query.filter_by(is_active=True).all()
        return jsonify([{
            'id': agent.id,
            'username': agent.username,
            'full_name': agent.full_name,
            'role': agent.role
        } for agent in agents]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
