import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { _mapContact } from 'src/_mock';

// import { ContactMap } from '../contact-map';
import { ContactHero } from '../contact-hero';
import { ContactFormData } from '../contact-form-data';
// import { ContactForm } from '../contact-form';

export function ContactView() {
  return (
    <div>
      <ContactHero />

      <Container sx={{ py: 10 }}>
        {/*
        <Box
          gap={10}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
      */}

        <ContactFormData />
        {/*
          <ContactForm />

          <ContactMap contacts={_mapContact} />
        */}
        {/*
        </Box>
      */}
      </Container>
    </div>
  );
}
