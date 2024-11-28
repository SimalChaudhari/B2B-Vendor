import Container from '@mui/material/Container';

import { _mapContact } from 'src/_mock';

import { ContactHero } from '../contact-hero';
import { ContactFormData } from '../contact-form-data';

export function ContactView() {
  return (
    <div>
      <ContactHero />

      <Container sx={{ py: 10 }}>

        <ContactFormData />
        
      </Container>
    </div>
  );
}
