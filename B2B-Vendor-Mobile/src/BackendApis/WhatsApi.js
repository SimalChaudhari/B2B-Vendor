import axios from 'axios';

export const sendWhatsAppMessage = async (message) => {
    const recipientNumber = '9723506358'; // WhatsApp number to send the message (with country code, no +)

    try {
        const response = await axios.post(
            'https://graph.facebook.com/v16.0/YOUR_WHATSAPP_NUMBER_ID/messages',
            {
                messaging_product: 'whatsapp',
                to: recipientNumber,
                type: 'text',
                text: {
                    body: message,
                },
            },
            {
                headers: {
                    Authorization: `Bearer YOUR_ACCESS_TOKEN`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Message sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    }
};