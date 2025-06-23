"""
WSGI entry point for production deployment.
Creates the Flask application instance for deployment platforms like Render.
"""
from src.main import create_app

# Create the Flask application instance
app = create_app()

if __name__ == '__main__':
    app.run()