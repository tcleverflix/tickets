from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models.ticket import Ticket
from app.models.comment import Comment
from app.services.n8n_service import N8nService
from app.services.auto_assign_service import AutoAssignService
from datetime import datetime

tickets_bp = Blueprint('tickets', __name__)

@tickets_bp.route('/tickets', methods=['GET'])
def get_tickets():
    """Get all tickets with optional filtering"""
    try:
        # Get query parameters for filtering
        status_filter = request.args.get('status')  # 'abierto', 'en_proceso', 'cerrado'
        assigned_filter = request.args.get('assigned')  # 'true', 'false', or None
        assigned_to_id = request.args.get('assigned_to_id')  # specific user id

        query = Ticket.query

        # Apply status filter
        if status_filter:
            query = query.filter(Ticket.status == status_filter)

        # Apply assigned filter
        if assigned_filter == 'false':
            query = query.filter(Ticket.assigned_to_id == None)
        elif assigned_filter == 'true':
            query = query.filter(Ticket.assigned_to_id != None)

        # Apply assigned_to_id filter
        if assigned_to_id:
            query = query.filter(Ticket.assigned_to_id == assigned_to_id)

        tickets = query.order_by(Ticket.created_at.desc()).all()
        return jsonify([ticket.to_dict() for ticket in tickets]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tickets_bp.route('/tickets/<int:ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    """Get specific ticket"""
    try:
        ticket = Ticket.query.get_or_404(ticket_id)
        return jsonify(ticket.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tickets_bp.route('/tickets', methods=['POST'])
def create_ticket():
    """Create new ticket"""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['client_name', 'client_email', 'subject', 'description']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        # Create new ticket
        ticket = Ticket(
            client_name=data['client_name'],
            client_email=data['client_email'],
            subject=data['subject'],
            description=data['description'],
            priority=data.get('priority', 'media'),
            category=data.get('category'),
            client_phone=data.get('client_phone'),
            department=data.get('department')
        )

        db.session.add(ticket)
        db.session.flush()  # Get ticket ID before auto-assign

        # Auto-assign to available agent
        was_assigned = AutoAssignService.assign_ticket_automatically(ticket)

        db.session.commit()

        # Step 1: ALWAYS notify client about ticket creation first
        N8nService.trigger_new_ticket_workflow(ticket.to_dict())

        # Step 2: If assigned, notify about assignment (n8n will handle delay)
        if was_assigned:
            # Notify client about assignment (with 10s delay in n8n)
            N8nService.trigger_update_ticket_workflow(
                ticket.to_dict(),
                f"Tu ticket ha sido asignado automáticamente a {ticket.assigned_user.full_name} quien estará trabajando en tu solicitud."
            )
            # Notify agent about new assignment
            N8nService.trigger_agent_assignment_workflow(ticket.to_dict())

        return jsonify(ticket.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tickets_bp.route('/tickets/<int:ticket_id>/status', methods=['PUT'])
def update_ticket_status(ticket_id):
    """Update ticket status"""
    try:
        ticket = Ticket.query.get_or_404(ticket_id)
        data = request.get_json()

        if 'status' not in data:
            return jsonify({'error': 'status is required'}), 400

        old_status = ticket.status
        old_agent_id = ticket.assigned_to_id
        ticket.status = data['status']
        ticket.updated_at = datetime.utcnow()

        db.session.commit()

        # Trigger n8n workflow if ticket is closed
        if old_status != 'cerrado' and ticket.status == 'cerrado':
            N8nService.trigger_close_ticket_workflow(ticket.to_dict())

            # Auto-assign next ticket to the agent who just became available
            if old_agent_id:
                next_ticket = AutoAssignService.assign_next_ticket_to_agent(old_agent_id)

                if next_ticket:
                    # Notify client about assignment (with 10s delay in n8n)
                    N8nService.trigger_update_ticket_workflow(
                        next_ticket.to_dict(),
                        f"Tu ticket ha sido asignado automáticamente a {next_ticket.assigned_user.full_name} quien estará trabajando en tu solicitud."
                    )
                    # Notify agent about new assignment
                    N8nService.trigger_agent_assignment_workflow(next_ticket.to_dict())

        return jsonify(ticket.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tickets_bp.route('/tickets/<int:ticket_id>', methods=['PUT'])
def update_ticket(ticket_id):
    """Update ticket details"""
    try:
        ticket = Ticket.query.get_or_404(ticket_id)
        data = request.get_json()

        # Update fields if provided
        if 'subject' in data:
            ticket.subject = data['subject']
        if 'description' in data:
            ticket.description = data['description']
        if 'priority' in data:
            ticket.priority = data['priority']
        if 'category' in data:
            ticket.category = data['category']
        if 'client_phone' in data:
            ticket.client_phone = data['client_phone']
        if 'department' in data:
            ticket.department = data['department']
        if 'assigned_to_id' in data:
            ticket.assigned_to_id = data['assigned_to_id']

        ticket.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify(ticket.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tickets_bp.route('/tickets/<int:ticket_id>/comments', methods=['GET'])
def get_ticket_comments(ticket_id):
    """Get comments for a specific ticket"""
    try:
        ticket = Ticket.query.get_or_404(ticket_id)
        comments = Comment.query.filter_by(ticket_id=ticket_id).order_by(Comment.created_at.asc()).all()
        return jsonify([comment.to_dict() for comment in comments]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tickets_bp.route('/tickets/<int:ticket_id>/comments', methods=['POST'])
def add_comment(ticket_id):
    """Add comment to ticket"""
    try:
        ticket = Ticket.query.get_or_404(ticket_id)
        data = request.get_json()

        # Validate required fields
        required_fields = ['author_name', 'author_email', 'comment_text']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        # Create new comment
        comment = Comment(
            ticket_id=ticket_id,
            author_name=data['author_name'],
            author_email=data['author_email'],
            comment_text=data['comment_text'],
            is_internal=data.get('is_internal', False)
        )

        db.session.add(comment)

        # Update ticket timestamp
        ticket.updated_at = datetime.utcnow()
        db.session.commit()

        # Trigger n8n workflow (only for non-internal comments)
        if not comment.is_internal:
            N8nService.trigger_update_ticket_workflow(ticket.to_dict(), comment.comment_text)

        return jsonify(comment.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tickets_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()}), 200