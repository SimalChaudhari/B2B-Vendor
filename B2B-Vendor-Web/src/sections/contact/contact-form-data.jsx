import React, { useEffect, useState } from 'react'; // Import React and useState
import Typography from '@mui/material/Typography';
import { Box, Card, CardContent, CircularProgress, Container } from '@mui/material';
import { getContactMessage } from 'src/services/contactUsApi';
import parse from 'html-react-parser';

// ----------------------------------------------------------------------

export function ContactFormData() {
  const [contactsData, setContactsData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getContactMessage();
        setContactsData(data); // Store data in state
        // console.log('Terms Data:', data); // Log fetched data
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
      <Typography variant="h3">
        Feel free to contact us. <br />
        We&apos;ll be glad to hear from you buddy.
      </Typography>


      {/*
        <div>{parse(contactsData.message || '<p>No Content Available</p>')}</div>
      */}

      <Container sx={{ py: 5, maxWidth: 'md' }}>
        <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>

          <CardContent>
            <Box sx={{ p: 3, textAlign: 'justify', lineHeight: 1.8 }}>
              {parse(contactsData?.message || '<p>No Content Available</p>')}
            </Box>
          </CardContent>
        </Card>
      </Container>

    </div>
  );
}
