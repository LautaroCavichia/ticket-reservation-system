"""
Development server entry point.

Runs the Flask development server with environment configuration
and database initialization for local development.
"""
import os
from flask_migrate import upgrade
from src.main import create_app
from src.core.extensions import db


def init_database():
    """Initialize database with tables and sample data."""
    with create_app().app_context():
        # Create all tables
        db.create_all()
        
        # Run any pending migrations
        try:
            upgrade()
        except Exception as e:
            print(f"Migration warning: {e}")
        
        # Add sample data for development
        create_sample_data()


def create_sample_data():
    """Create sample events and users with Italian/Tuscan theme."""
    from datetime import datetime, timedelta
    from src.auth.models import User, UserRole
    from src.apps.events.models import Event
    import random
    
    # Check if sample data already exists
    if User.query.first() or Event.query.first():
        print("Sample data already exists, skipping creation")
        return
    
    # Create sample users
    admin_user = User(
        email='admin@toscana.it',
        first_name='Lautaro',
        last_name='Cavichia',
        role=UserRole.REGISTERED
    )
    admin_user.set_password('admin123')
    admin_user.save()
    
    regular_user = User(
        email='user@toscana.it',
        first_name='Bruno',
        last_name='Cavichia',
        role=UserRole.REGISTERED
    )
    regular_user.set_password('user123')
    regular_user.save()
    
    # Enhanced Italian/Tuscan events data
    events_data = [
        # Music Events - Real Italian bands and international acts
        {
            'title': 'Concerto dei Negramaro - Estate Fiorentina',
            'description': 'Una serata indimenticabile con uno dei gruppi più amati d\'Italia. I Negramaro tornano a Firenze con il loro nuovo tour, portando i loro successi più celebri e le nuove canzoni dell\'ultimo album.',
            'event_date': datetime.utcnow() + timedelta(days=15),
            'venue_name': 'Anfiteatro delle Cascine',
            'venue_address': 'Parco delle Cascine, Firenze, FI 50144',
            'total_capacity': 8000,
            'ticket_price': 45.00
        },
        {
            'title': 'Festival della Musica Toscana - Giorgia & Elisa',
            'description': 'Due voci straordinarie del panorama musicale italiano si esibiscono insieme in un concerto esclusivo. Un evento unico nel suggestivo scenario delle colline toscane.',
            'event_date': datetime.utcnow() + timedelta(days=30),
            'venue_name': 'Villa San Martino',
            'venue_address': 'Via San Martino 12, Siena, SI 53100',
            'total_capacity': 3000,
            'ticket_price': 65.00
        },
        {
            'title': 'Jovanotti - Jova Beach Party Versilia',
            'description': 'Il party più atteso dell\'estate torna in Versilia! Lorenzo Jovanotti porta la sua energia contagiosa sulla spiaggia per una notte di musica e divertimento.',
            'event_date': datetime.utcnow() + timedelta(days=45),
            'venue_name': 'Spiaggia di Forte dei Marmi',
            'venue_address': 'Lungomare Italico, Forte dei Marmi, LU 55042',
            'total_capacity': 12000,
            'ticket_price': 55.00
        },
        {
            'title': 'Måneskin - Rock in Chianti',
            'description': 'I vincitori dell\'Eurovision tornano in Italia per un concerto esplosivo. La band romana che ha conquistato il mondo si esibisce nel cuore del Chianti.',
            'event_date': datetime.utcnow() + timedelta(days=60),
            'venue_name': 'Castello di Brolio',
            'venue_address': 'Località Brolio, Gaiole in Chianti, SI 53013',
            'total_capacity': 5000,
            'ticket_price': 75.00
        },
        
        # Tech Events
        {
            'title': 'TechItalia Conference 2025 - AI e Futuro',
            'description': 'La più importante conferenza tecnologica italiana. Esperti internazionali discutono le ultime innovazioni in intelligenza artificiale, blockchain e sostenibilità digitale.',
            'event_date': datetime.utcnow() + timedelta(days=25),
            'venue_name': 'Palazzo dei Congressi',
            'venue_address': 'Piazza Adua 1, Firenze, FI 50123',
            'total_capacity': 1500,
            'ticket_price': 180.00
        },
        {
            'title': 'Startup Weekend Tuscany',
            'description': '54 ore per trasformare la tua idea in un business. Imprenditori, designer e sviluppatori si incontrano per creare le startup del futuro nel cuore della Toscana.',
            'event_date': datetime.utcnow() + timedelta(days=35),
            'venue_name': 'Impact Hub Firenze',
            'venue_address': 'Via Panciatichi 10, Firenze, FI 50127',
            'total_capacity': 200,
            'ticket_price': 95.00
        },
        {
            'title': 'Digital Wine Conference - Innovazione nel Settore Vinicolo',
            'description': 'Come la tecnologia sta rivoluzionando il mondo del vino. Produttori, sommelier e esperti di digital marketing si incontrano per esplorare le nuove frontiere del settore.',
            'event_date': datetime.utcnow() + timedelta(days=50),
            'venue_name': 'Castello di Verrazzano',
            'venue_address': 'Via San Martino in Valle 12, Greve in Chianti, FI 50022',
            'total_capacity': 300,
            'ticket_price': 120.00
        },
        
        # Cultural and Arts Events
        {
            'title': 'Notte Bianca dell\'Arte - Uffizi Experience',
            'description': 'Una notte speciale agli Uffizi con visite guidate esclusive, installazioni contemporanee e performance artistiche. Un viaggio unico attraverso l\'arte rinascimentale e moderna.',
            'event_date': datetime.utcnow() + timedelta(days=20),
            'venue_name': 'Galleria degli Uffizi',
            'venue_address': 'Piazzale degli Uffizi 6, Firenze, FI 50122',
            'total_capacity': 500,
            'ticket_price': 85.00
        },
        {
            'title': 'Festival del Cinema di Montepulciano',
            'description': 'Proiezioni di film indipendenti, masterclass con registi internazionali e premiazioni nella splendida cornice di Montepulciano. Un evento imperdibile per gli amanti del cinema.',
            'event_date': datetime.utcnow() + timedelta(days=40),
            'venue_name': 'Teatro Poliziano',
            'venue_address': 'Via del Teatro 4, Montepulciano, SI 53045',
            'total_capacity': 400,
            'ticket_price': 35.00
        },
        
        # Food & Wine Events
        {
            'title': 'Sagra del Tartufo Bianco - San Miniato',
            'description': 'La più prestigiosa sagra dedicata al tartufo bianco. Degustazioni, cooking show con chef stellati e mercatini con i migliori prodotti del territorio toscano.',
            'event_date': datetime.utcnow() + timedelta(days=12),
            'venue_name': 'Centro Storico di San Miniato',
            'venue_address': 'Piazza del Popolo, San Miniato, PI 56027',
            'total_capacity': 2000,
            'ticket_price': 25.00
        },
        {
            'title': 'Chianti Classico Wine Festival',
            'description': 'Degustazione dei migliori vini del Chianti Classico con produttori locali. Include tour guidati nelle cantine storiche e abbinamenti gastronomici d\'eccellenza.',
            'event_date': datetime.utcnow() + timedelta(days=55),
            'venue_name': 'Castello di Meleto',
            'venue_address': 'Località Meleto, Gaiole in Chianti, SI 53013',
            'total_capacity': 800,
            'ticket_price': 95.00
        },
        
        # Past Events for demonstration
        {
            'title': 'Concerto di Laura Pausini - Tour Mondiale [PASSATO]',
            'description': 'La regina della musica italiana ha incantato il pubblico con i suoi successi internazionali in una serata magica sotto le stelle toscane.',
            'event_date': datetime.utcnow() - timedelta(days=30),
            'venue_name': 'Arena di Verona',
            'venue_address': 'Piazza Bra 1, Verona, VR 37121',
            'total_capacity': 15000,
            'ticket_price': 80.00
        },
        {
            'title': 'TEDx Firenze 2024 - Innovazione e Tradizione [PASSATO]',
            'description': 'Speaker internazionali hanno condiviso le loro visioni sul futuro, combinando innovazione tecnologica e tradizione toscana.',
            'event_date': datetime.utcnow() - timedelta(days=60),
            'venue_name': 'Teatro del Maggio Musicale',
            'venue_address': 'Piazzale Vittorio Gui 1, Firenze, FI 50144',
            'total_capacity': 1800,
            'ticket_price': 150.00
        },
        {
            'title': 'Pitti Uomo Fashion Week [PASSATO]',
            'description': 'La settimana della moda maschile più importante al mondo ha presentato le collezioni primavera-estate nel cuore di Firenze.',
            'event_date': datetime.utcnow() - timedelta(days=45),
            'venue_name': 'Fortezza da Basso',
            'venue_address': 'Viale Filippo Strozzi 1, Firenze, FI 50129',
            'total_capacity': 5000,
            'ticket_price': 200.00
        }
    ]
    
    # Create events with realistic ticket sales
    for event_data in events_data:
        event = Event(**event_data)
        
        # Simulate realistic ticket sales for past events
        if event.event_date < datetime.utcnow():
            # Past events should be mostly sold out or have high occupancy
            sold_percentage = random.uniform(0.7, 1.0)
            tickets_sold = int(event.total_capacity * sold_percentage)
            event.available_tickets = max(0, event.total_capacity - tickets_sold)
        else:
            # Future events have varying availability
            sold_percentage = random.uniform(0.1, 0.8)
            tickets_sold = int(event.total_capacity * sold_percentage)
            event.available_tickets = event.total_capacity - tickets_sold
        
        event.save()
    
    print("Enhanced Italian/Tuscan sample data created successfully!")
    print(f"Created {len(events_data)} events with realistic occupancy rates")
    print("Eventi creati con successo! 🇮🇹")


if __name__ == '__main__':
    app = create_app()
    
    # Initialize database on startup
    init_database()
    
    # Run development server
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5500)),
        debug=True
    )