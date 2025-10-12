#!/usr/bin/env python3
"""
Script to create an initial admin user
Usage: python create_admin.py
"""

from app import create_app, db
from app.models.user import User

def create_admin_user():
    app = create_app('development')

    with app.app_context():
        # Check if admin already exists
        admin = User.query.filter_by(username='admin').first()

        if admin:
            print("❌ Admin user already exists!")
            print(f"   Username: {admin.username}")
            print(f"   Email: {admin.email}")
            return

        # Create admin user
        admin = User(
            username='admin',
            email='admin@tickkk.com',
            full_name='Administrator',
            role='admin',
            is_active=True
        )
        admin.set_password('admin123')  # Change this password after first login!

        db.session.add(admin)
        db.session.commit()

        print("✅ Admin user created successfully!")
        print(f"   Username: admin")
        print(f"   Password: admin123")
        print(f"   Email: {admin.email}")
        print(f"   Role: {admin.role}")
        print("\n⚠️  IMPORTANT: Change the password after first login!")

def create_sample_agents():
    """Create sample agent users for testing"""
    app = create_app('development')

    with app.app_context():
        agents_data = [
            {
                'username': 'juan_perez',
                'email': 'juan@tickkk.com',
                'full_name': 'Juan Pérez',
                'password': 'agent123'
            },
            {
                'username': 'maria_garcia',
                'email': 'maria@tickkk.com',
                'full_name': 'María García',
                'password': 'agent123'
            }
        ]

        created_count = 0
        for agent_data in agents_data:
            # Check if agent already exists
            existing = User.query.filter_by(username=agent_data['username']).first()
            if existing:
                print(f"⚠️  Agent '{agent_data['username']}' already exists, skipping...")
                continue

            agent = User(
                username=agent_data['username'],
                email=agent_data['email'],
                full_name=agent_data['full_name'],
                role='agent',
                is_active=True
            )
            agent.set_password(agent_data['password'])

            db.session.add(agent)
            created_count += 1
            print(f"✅ Agent '{agent_data['username']}' created")

        if created_count > 0:
            db.session.commit()
            print(f"\n✅ Created {created_count} agent user(s)")

if __name__ == '__main__':
    print("=" * 50)
    print("Creating Admin and Sample Users")
    print("=" * 50)
    print()

    create_admin_user()
    print()
    create_sample_agents()
    print()
    print("=" * 50)
    print("Setup Complete!")
    print("=" * 50)
