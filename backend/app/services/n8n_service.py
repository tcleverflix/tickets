import requests
import logging
from flask import current_app

logger = logging.getLogger(__name__)

class N8nService:
    @staticmethod
    def trigger_new_ticket_workflow(ticket_data):
        """Trigger n8n workflow for new ticket creation"""
        try:
            webhook_url = current_app.config['N8N_WEBHOOK_NEW_TICKET']
            # Send data in snake_case as n8n expects
            payload = {
                # snake_case (original)
                'ticket_id': ticket_data['id'],
                'client_name': ticket_data['client_name'],
                'client_email': ticket_data['client_email'],
                'client_phone': ticket_data.get('client_phone'),
                'subject': ticket_data['subject'],
                'description': ticket_data['description'],
                'priority': ticket_data['priority'],
                'department': ticket_data.get('department'),
                'category': ticket_data.get('category'),
                # camelCase aliases (workflow compatibility)
                'ticketId': ticket_data['id'],
                'clientName': ticket_data['client_name'],
                'clientEmail': ticket_data['client_email'],
                'clientPhone': ticket_data.get('client_phone'),
                'department': ticket_data.get('department'),
                'category': ticket_data.get('category'),
                'priority': ticket_data['priority'],
                'subject': ticket_data['subject'],
                'description': ticket_data['description']
            }

            logger.info(f"Sending payload to n8n: {payload}")
            response = requests.post(webhook_url, json=payload, timeout=10)
            response.raise_for_status()
            logger.info(f"New ticket workflow triggered for ticket {ticket_data['id']}")
            return True

        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to trigger new ticket workflow: {str(e)}")
            return False

    @staticmethod
    def trigger_update_ticket_workflow(ticket_data, comment_text):
        """Trigger n8n workflow for ticket update"""
        try:
            webhook_url = current_app.config['N8N_WEBHOOK_UPDATE_TICKET']

            # Get agent info if assigned
            agent_name = None
            agent_email = None
            if ticket_data.get('assigned_to'):
                agent_name = ticket_data['assigned_to'].get('full_name')
                agent_email = ticket_data['assigned_to'].get('email')

            # Send data in snake_case as n8n expects
            payload = {
                # snake_case (original)
                'ticket_id': ticket_data['id'],
                'client_name': ticket_data['client_name'],
                'client_email': ticket_data['client_email'],
                'client_phone': ticket_data.get('client_phone'),
                'subject': ticket_data['subject'],
                'comment_text': comment_text,
                'agent_name': agent_name,
                'agent_email': agent_email,
                'department': ticket_data.get('department'),
                'category': ticket_data.get('category'),
                # camelCase aliases (workflow compatibility)
                'ticketId': ticket_data['id'],
                'clientName': ticket_data['client_name'],
                'clientEmail': ticket_data['client_email'],
                'clientPhone': ticket_data.get('client_phone'),
                'subject': ticket_data['subject'],
                'commentText': comment_text,
                'agentName': agent_name,
                'agentEmail': agent_email,
                'department': ticket_data.get('department'),
                'category': ticket_data.get('category')
            }

            logger.info(f"Sending payload to n8n: {payload}")
            response = requests.post(webhook_url, json=payload, timeout=10)
            response.raise_for_status()
            logger.info(f"Update ticket workflow triggered for ticket {ticket_data['id']}")
            return True

        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to trigger update ticket workflow: {str(e)}")
            return False

    @staticmethod
    def trigger_close_ticket_workflow(ticket_data):
        """Trigger n8n workflow for ticket closure"""
        try:
            webhook_url = current_app.config['N8N_WEBHOOK_CLOSE_TICKET']

            # Get agent info if assigned
            agent_name = None
            agent_email = None
            if ticket_data.get('assigned_to'):
                agent_name = ticket_data['assigned_to'].get('full_name')
                agent_email = ticket_data['assigned_to'].get('email')

            # Send data in snake_case as n8n expects
            payload = {
                # snake_case (original)
                'ticket_id': ticket_data['id'],
                'client_name': ticket_data['client_name'],
                'client_email': ticket_data['client_email'],
                'client_phone': ticket_data.get('client_phone'),
                'subject': ticket_data['subject'],
                'agent_name': agent_name,
                'agent_email': agent_email,
                'department': ticket_data.get('department'),
                'category': ticket_data.get('category'),
                # camelCase aliases (workflow compatibility)
                'ticketId': ticket_data['id'],
                'clientName': ticket_data['client_name'],
                'clientEmail': ticket_data['client_email'],
                'clientPhone': ticket_data.get('client_phone'),
                'subject': ticket_data['subject'],
                'agentName': agent_name,
                'agentEmail': agent_email,
                'department': ticket_data.get('department'),
                'category': ticket_data.get('category')
            }

            logger.info(f"Sending payload to n8n: {payload}")
            response = requests.post(webhook_url, json=payload, timeout=10)
            response.raise_for_status()
            logger.info(f"Close ticket workflow triggered for ticket {ticket_data['id']}")
            return True

        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to trigger close ticket workflow: {str(e)}")
            return False

    @staticmethod
    def trigger_agent_assignment_workflow(ticket_data):
        """Trigger n8n workflow to notify agent about new assignment"""
        try:
            webhook_url = current_app.config['N8N_WEBHOOK_AGENT_ASSIGNMENT']

            # Get agent info
            agent_name = None
            agent_email = None
            if ticket_data.get('assigned_to'):
                agent_name = ticket_data['assigned_to'].get('full_name')
                agent_email = ticket_data['assigned_to'].get('email')

            # Send data in snake_case as n8n expects
            payload = {
                # snake_case (original)
                'ticket_id': ticket_data['id'],
                'client_name': ticket_data['client_name'],
                'client_email': ticket_data['client_email'],
                'client_phone': ticket_data.get('client_phone'),
                'subject': ticket_data['subject'],
                'description': ticket_data['description'],
                'priority': ticket_data['priority'],
                'category': ticket_data.get('category'),
                'department': ticket_data.get('department'),
                'agent_name': agent_name,
                'agent_email': agent_email,
                # camelCase aliases (workflow compatibility)
                'ticketId': ticket_data['id'],
                'clientName': ticket_data['client_name'],
                'clientEmail': ticket_data['client_email'],
                'clientPhone': ticket_data.get('client_phone'),
                'subject': ticket_data['subject'],
                'description': ticket_data['description'],
                'priority': ticket_data['priority'],
                'category': ticket_data.get('category'),
                'department': ticket_data.get('department'),
                'agentName': agent_name,
                'agentEmail': agent_email
            }

            logger.info(f"Sending agent assignment notification to n8n: {payload}")
            response = requests.post(webhook_url, json=payload, timeout=10)
            response.raise_for_status()
            logger.info(f"Agent assignment workflow triggered for ticket {ticket_data['id']} to {agent_name}")
            return True

        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to trigger agent assignment workflow: {str(e)}")
            return False