"""
Flask application factory and configuration.

Creates and configures the Flask application with all blueprints,
extensions, and error handlers for the ticket reservation system.
"""
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager

from src.core.config import get_config
from src.core.extensions import init_extensions
from src.auth.views import auth_bp
from src.apps.events.views import events_bp
from src.apps.reservations.views import reservations_bp


def create_app() -> Flask:
    """
    Application factory pattern for creating Flask app.
    
    Configures the application with all necessary components
    including database, authentication, and API blueprints.
    """
    app = Flask(__name__)
    
    # Load configuration
    config = get_config()
    app.config.from_object(config)
    
    # Initialize extensions
    init_extensions(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(events_bp)
    app.register_blueprint(reservations_bp)
    
    # Register error handlers
    register_error_handlers(app)
    
    # Add health check endpoint
    @app.route('/api/health')
    def health_check():
        """Simple health check endpoint for monitoring."""
        return jsonify({
            'status': 'healthy',
            'message': 'Ticket Reservation API is running'
        }), 200
    
    # Add API documentation endpoint
    @app.route('/api')
    def api_info():
        """API information and available endpoints."""
        return jsonify({
            'name': 'Ticket Reservation API',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/auth/*',
                'events': '/api/events/*',
                'reservations': '/api/reservations/*',
                'health': '/api/health'
            }
        }), 200
    
    return app


def register_error_handlers(app: Flask):
    """Register custom error handlers for consistent API responses."""
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad request'}), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({'error': 'Unauthorized'}), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({'error': 'Forbidden'}), 403
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({'error': 'Method not allowed'}), 405
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    # JWT error handlers
    @app.errorhandler(422)
    def jwt_error(error):
        return jsonify({'error': 'Invalid token'}), 422
