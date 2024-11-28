import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { _faqs } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { useEffect, useState } from 'react';
import { CircularProgress, Container } from '@mui/material';
import { getFaqData } from 'src/services/faqApi';

// ----------------------------------------------------------------------

export function FaqsList() {

  const [contactsData, setContactsData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFaqData();
        setContactsData(data.data); // Store data in state
      } catch (err) {
        console.error('Error fetching terms and condition data:', err);
        setError('Failed to fetch terms and condition data'); // Set error message
      } finally {
        setLoading(false); // Ensure loading stops
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs once on mount

  if (loading) {
    return (
      <Container sx={{ py: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress /> {/* Loading indicator */}
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <div>
      {contactsData.map((accordion) => (
        <Accordion key={accordion.id}>
          <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
            <Typography variant="subtitle1">{accordion.question}</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography>{accordion.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
