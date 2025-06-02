/**
 * Ticket Download Service
 * 
 * Generates PDF tickets and QR codes for confirmed reservations
 */
import { Reservation } from '../types/reservations';

// Mock QR code generation
const generateQRCode = (data: string): string => {
  // In a real app, use a library like qrcode.js
  // For demo purposes, return a placeholder QR code image
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
};

// Generate ticket data for QR code
const generateTicketData = (reservation: Reservation): string => {
  return JSON.stringify({
    id: reservation.id,
    event: reservation.event.title,
    date: reservation.event.event_date,
    venue: reservation.event.venue_name,
    tickets: reservation.ticket_quantity,
    holder: reservation.user.full_name,
    verified: true
  });
};

// Generate PDF content (HTML that can be converted to PDF)
const generateTicketHTML = (reservation: Reservation, qrCodeUrl: string): string => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Biglietto - ${reservation.event.title}</title>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #F5F5DC 0%, #DEB887 100%);
            color: #2d2d2d;
        }
        .ticket {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(139, 69, 19, 0.2);
            position: relative;
        }
        .ticket::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(135deg, #8B4513 0%, #DAA520 100%);
        }
        .header {
            background: linear-gradient(135deg, #8B4513 0%, #654321 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .subtitle {
            opacity: 0.9;
            font-size: 14px;
        }
        .content {
            padding: 30px;
        }
        .event-title {
            font-size: 24px;
            font-weight: bold;
            color: #8B4513;
            margin-bottom: 20px;
            text-align: center;
        }
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        .detail-item {
            background: #F5F5DC;
            padding: 15px;
            border-radius: 12px;
            border-left: 4px solid #DAA520;
        }
        .detail-label {
            font-size: 12px;
            color: #8B4513;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .detail-value {
            font-size: 16px;
            color: #2d2d2d;
            font-weight: 500;
        }
        .qr-section {
            text-align: center;
            padding: 20px;
            background: #F5F5DC;
            border-radius: 12px;
            margin-bottom: 20px;
        }
        .qr-code {
            width: 150px;
            height: 150px;
            margin: 0 auto 15px;
            background: white;
            padding: 10px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(139, 69, 19, 0.1);
        }
        .reservation-id {
            font-family: 'Courier New', monospace;
            font-size: 18px;
            font-weight: bold;
            color: #8B4513;
            margin-bottom: 5px;
        }
        .instructions {
            font-size: 12px;
            color: #666;
            line-height: 1.5;
        }
        .footer {
            text-align: center;
            padding: 20px;
            border-top: 1px solid #E5E5E5;
            background: #FAFAFA;
            font-size: 12px;
            color: #666;
        }
        .important-notice {
            background: #FFF3CD;
            border: 1px solid #FFEAA7;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
        }
        .important-notice h4 {
            margin: 0 0 10px 0;
            color: #B8860B;
            font-size: 14px;
        }
        .important-notice ul {
            margin: 0;
            padding-left: 20px;
            font-size: 12px;
            color: #8B7500;
        }
        .ticket-stub {
            border-top: 2px dashed #DDD;
            margin-top: 20px;
            padding-top: 20px;
            text-align: center;
        }
        @media print {
            body { background: white; padding: 0; }
            .ticket { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="ticket">
        <div class="header">
            <div class="logo">🎫 ToscanaEvents</div>
            <div class="subtitle">Biglietto Elettronico Ufficiale</div>
        </div>
        
        <div class="content">
            <h1 class="event-title">${reservation.event.title}</h1>
            
            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-label">📅 Data & Ora</div>
                    <div class="detail-value">${formatDate(reservation.event.event_date)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">📍 Luogo</div>
                    <div class="detail-value">${reservation.event.venue_name}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">🎫 Biglietti</div>
                    <div class="detail-value">${reservation.ticket_quantity} x ${formatPrice(reservation.unit_price)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">💰 Totale Pagato</div>
                    <div class="detail-value">${formatPrice(reservation.total_amount)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">👤 Intestatario</div>
                    <div class="detail-value">${reservation.user.full_name}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">🏢 Indirizzo Venue</div>
                    <div class="detail-value">${reservation.event.venue_address}</div>
                </div>
            </div>
            
            <div class="qr-section">
                <img src="${qrCodeUrl}" alt="QR Code" class="qr-code" />
                <div class="reservation-id">ID: #${reservation.id.toString().padStart(6, '0')}</div>
                <div class="instructions">
                    Presenta questo QR code all'ingresso insieme a un documento d'identità valido
                </div>
            </div>
            
            <div class="important-notice">
                <h4>⚠️ Informazioni Importanti</h4>
                <ul>
                    <li>Questo biglietto è valido solo per la data e l'ora specificati</li>
                    <li>È richiesto un documento d'identità valido per l'ingresso</li>
                    <li>Il biglietto non è rimborsabile salvo cancellazione dell'evento</li>
                    <li>Presentarsi almeno 30 minuti prima dell'inizio dell'evento</li>
                    <li>Vietato il trasferimento del biglietto a terzi senza autorizzazione</li>
                </ul>
            </div>
            
            <div class="ticket-stub">
                <strong>Conserva questo biglietto per tutta la durata dell'evento</strong><br>
                <small>Per assistenza: info@toscanaevents.it | +39 055 123 4567</small>
            </div>
        </div>
        
        <div class="footer">
            ToscanaEvents © 2025 - Biglietto generato il ${new Date().toLocaleDateString('it-IT')} alle ${new Date().toLocaleTimeString('it-IT')}
        </div>
    </div>
</body>
</html>`;
};

export const TicketDownloadService = {
  // Generate and download PDF ticket
  downloadPDFTicket: (reservation: Reservation) => {
    const ticketData = generateTicketData(reservation);
    const qrCodeUrl = generateQRCode(ticketData);
    const htmlContent = generateTicketHTML(reservation, qrCodeUrl);
    
    // Create a new window for printing/PDF generation
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load, then trigger print dialog
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 1000);
    }
  },

  // Download QR code only
  downloadQRCode: (reservation: Reservation) => {
    const ticketData = generateTicketData(reservation);
    const qrCodeUrl = generateQRCode(ticketData);
    
    // Create download link
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-ticket-${reservation.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Get QR code URL for display
  getQRCodeUrl: (reservation: Reservation): string => {
    const ticketData = generateTicketData(reservation);
    return generateQRCode(ticketData);
  },

  // Generate ticket data for verification
  generateTicketData,

  // Validate ticket data
  validateTicketData: (qrData: string): boolean => {
    try {
      const data = JSON.parse(qrData);
      return data.verified === true && data.id && data.event;
    } catch {
      return false;
    }
  }
};