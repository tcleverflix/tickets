"""
Auto-assignment service for tickets
Assigns tickets automatically to available agents using round-robin
"""
import random
from app.models.user import User
from app.models.ticket import Ticket
from app import db


class AutoAssignService:

    @staticmethod
    def get_available_agents():
        """
        Get all agents who are NOT currently assigned to any active ticket
        Active tickets = status is 'abierto' or 'en_proceso'
        """
        # Get all agents (non-admin users)
        all_agents = User.query.filter(
            User.role == 'agent',
            User.is_active == True
        ).all()

        if not all_agents:
            return []

        # Get agents who have active tickets assigned
        busy_agent_ids = db.session.query(Ticket.assigned_to_id).filter(
            Ticket.assigned_to_id.isnot(None),
            Ticket.status.in_(['abierto', 'en_proceso'])
        ).distinct().all()

        # Flatten the list of tuples to a list of IDs
        busy_agent_ids = [agent_id[0] for agent_id in busy_agent_ids]

        # Filter out busy agents
        available_agents = [
            agent for agent in all_agents
            if agent.id not in busy_agent_ids
        ]

        return available_agents

    @staticmethod
    def assign_ticket_automatically(ticket):
        """
        Automatically assign a ticket to an available agent
        Returns: True if assigned successfully, False otherwise
        """
        available_agents = AutoAssignService.get_available_agents()

        if not available_agents:
            # No agents available, leave ticket unassigned
            print(f"⚠️  No available agents for ticket #{ticket.id}")
            return False

        # Select random agent from available ones
        selected_agent = random.choice(available_agents)

        # Assign ticket
        ticket.assigned_to_id = selected_agent.id

        # Change status to 'en_proceso' when assigned
        if ticket.status == 'abierto':
            ticket.status = 'en_proceso'

        print(f"✅ Ticket #{ticket.id} auto-assigned to {selected_agent.full_name} (ID: {selected_agent.id})")

        return True

    @staticmethod
    def get_oldest_unassigned_ticket():
        """
        Get the oldest ticket that is not assigned to any agent
        Returns: Ticket object or None
        """
        unassigned_ticket = Ticket.query.filter(
            Ticket.assigned_to_id.is_(None),
            Ticket.status.in_(['abierto', 'en_proceso'])
        ).order_by(Ticket.created_at.asc()).first()

        return unassigned_ticket

    @staticmethod
    def assign_next_ticket_to_agent(agent_id):
        """
        Assign the oldest unassigned ticket to a specific agent
        Returns: Ticket object if assigned, None otherwise
        """
        oldest_ticket = AutoAssignService.get_oldest_unassigned_ticket()

        if not oldest_ticket:
            print(f"ℹ️  No hay tickets sin asignar para el agente ID {agent_id}")
            return None

        # Assign ticket to the agent
        oldest_ticket.assigned_to_id = agent_id

        # Change status to 'en_proceso' when assigned
        if oldest_ticket.status == 'abierto':
            oldest_ticket.status = 'en_proceso'

        db.session.commit()

        print(f"✅ Ticket #{oldest_ticket.id} auto-asignado al agente ID {agent_id} ({oldest_ticket.assigned_user.full_name})")

        return oldest_ticket

    @staticmethod
    def get_agent_stats():
        """
        Get statistics about agent workload
        Returns dict with agent info and their active ticket count
        """
        agents = User.query.filter(
            User.role == 'agent',
            User.is_active == True
        ).all()

        stats = []
        for agent in agents:
            active_tickets = Ticket.query.filter(
                Ticket.assigned_to_id == agent.id,
                Ticket.status.in_(['abierto', 'en_proceso'])
            ).count()

            stats.append({
                'agent_id': agent.id,
                'agent_name': agent.full_name,
                'agent_email': agent.email,
                'active_tickets': active_tickets,
                'is_available': active_tickets == 0
            })

        return stats
