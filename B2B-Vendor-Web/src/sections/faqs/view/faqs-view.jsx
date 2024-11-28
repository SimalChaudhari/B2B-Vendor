import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { FaqsHero } from '../faqs-hero';
import { FaqsList } from '../faqs-list';

// ----------------------------------------------------------------------

export function FaqsView() {
  return (
    <div>
      <FaqsHero />

      <Container sx={{ pb: 10, pt: { xs: 10, md: 1 }, position: 'relative' }}>


        <Typography variant="h3" sx={{ my: { xs: 5, md: 10 } }}>
          Frequently asked questions
        </Typography>

        <Box>
        
          <FaqsList />

        </Box>
      </Container>
    </div>
  );
}
