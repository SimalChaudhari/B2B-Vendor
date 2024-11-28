import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { fPercent } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';
import { varAlpha, stylesMode } from 'src/theme/styles';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

export function AboutWhat() {
  const theme = useTheme();

  return (
    <Container
      component={MotionViewport}
      sx={{ py: { xs: 10, md: 15 }, textAlign: { xs: 'center', md: 'unset' } }}
    >
      <Grid container columnSpacing={{ md: 3 }} alignItems="flex-start">
        <Grid
          container
          xs={12}
          md={6}
          lg={7}
          alignItems="center"
          sx={{
            pr: { md: 7 },
            display: { xs: 'none', md: 'flex' },
          }}
        >
          <Grid xs={6}>
            <m.div variants={varFade().inUp}>
              <Image
                alt="Our office small"
                src={`${CONFIG.site.basePath}/assets/images/about/what-small.webp`}
                ratio="1/1"
                sx={{
                  borderRadius: 3,
                  boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
                  [stylesMode.dark]: {
                    boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
                  },
                }}
              />
            </m.div>
          </Grid>

          <Grid xs={6}>
            <m.div variants={varFade().inUp}>
              <Image
                alt="Our office large"
                src={`${CONFIG.site.basePath}/assets/images/about/what-large.webp`}
                ratio="3/4"
                sx={{
                  borderRadius: 3,
                  boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
                  [stylesMode.dark]: {
                    boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
                  },
                }}
              />
            </m.div>
          </Grid>
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          <m.div variants={varFade().inRight}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              About Us
            </Typography>
          </m.div>

          <m.div variants={varFade().inRight} className='About_TXT'>
            <Typography
              sx={{ color: 'text.secondary', [stylesMode.dark]: { color: 'common.white' } }}
            >
              Techno Industrial Products is a leading provider of innovative and high-quality industrial solutions.
              With a strong commitment to excellence, we specialize in delivering cutting-edge technology and advanced
              industrial products that cater to the needs of diverse industries, from manufacturing and construction to
              energy and automation.
            </Typography>

            <Typography
              sx={{ color: 'text.secondary', my: 2, [stylesMode.dark]: { color: 'common.white' } }}
            >
              Founded with a vision to revolutionize the industrial sector, we offer a wide range of products designed
              to enhance operational efficiency, improve performance, and drive sustainable growth.
            </Typography>
          </m.div>

          {/*
            <m.div variants={varFade().inRight}>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
              >
                Our work
              </Button>
            </m.div>
          */}
        </Grid>
      </Grid>

      <div className='About_TXT'>
        <Grid container spacing={3} sx={{ my: 5 }}>
          {/* First Row: Our Mission and Our Vision */}
          <Grid item xs={12} md={6}>
            <Box variants={varFade().inRight}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                At Techno Industrial Products, our mission is to provide the highest quality industrial solutions that empower businesses to achieve their goals. We strive to offer products that not only meet but exceed the expectations of our clients, while maintaining the highest standards of safety, reliability, and efficiency.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box variants={varFade().inRight}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                Our Vision
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                We envision becoming a global leader in the industrial products sector, known for our innovation, customer-centric approach, and commitment to sustainable practices. We aim to provide businesses with the tools they need to succeed in an ever-evolving industrial landscape.
              </Typography>
            </Box>
          </Grid>

          {/* Second Row: What We Do and Why Choose Us */}
          <Grid item xs={12} md={6}>
            <Box variants={varFade().inRight}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                What We Do
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                We manufacture and supply a broad range of products and systems for various industries, including:
              </Typography><br />
              <ul style={{ listStyleType: 'disc', color: 'text.secondary', marginLeft: "20px", marginTop: "10px" }}>
                <li>Industrial Automation Systems</li>
                <li>Precision Machinery</li>
                <li>Electrical Components & Tools</li>
                <li>Construction Equipment</li>
                <li>Energy Solutions</li>
              </ul>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box variants={varFade().inRight}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                Why Choose Us?
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                <strong>Quality & Reliability:</strong> All our products are built to the highest industry standards, ensuring maximum reliability and durability.
                <br />
                <br />
                <strong>Innovation:</strong> We continuously innovate, adopting the latest technological advancements to offer our customers the best solutions available.
                <br />
                <br />
                <strong>Customer Focus:</strong> Our clients’ success is our priority. We provide personalized service and customized solutions tailored to each business’s unique needs.
                <br />
                <br />
                <strong>Global Reach:</strong> With a wide network of partners and suppliers, we serve industries around the world, ensuring quick delivery and exceptional after-sales support.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </div>

    </Container>
  );
}
