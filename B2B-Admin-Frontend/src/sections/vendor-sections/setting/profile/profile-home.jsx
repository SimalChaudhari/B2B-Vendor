import { useRef } from 'react';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputBase from '@mui/material/InputBase';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import { _socials } from 'src/_mock';
import { varAlpha } from 'src/theme/styles';

import { Iconify, SocialIcon } from 'src/components/iconify';

import { ProfilePostItem } from './profile-post-item';

// ----------------------------------------------------------------------

export function ProfileHome({ info, posts }) {
  const fileRef = useRef(null);

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };



  const renderAbout = (
    <Card>
      <CardHeader title="About" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Box sx={{ typography: 'body2' }}>{info.quote}</Box>

        <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:location-fill" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {`Live at `}
            <Link variant="subtitle2" color="inherit">
              {info.country}
            </Link>
          </Box>
        </Stack>

        <Stack direction="row" sx={{ typography: 'body2' }}>
          <Iconify icon="fluent:mail-24-filled" width={24} sx={{ mr: 2 }} />
          {info.email}
        </Stack>

        <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-business-center" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {info.role} {`at `}
            <Link variant="subtitle2" color="inherit">
              {info.company}
            </Link>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-business-center" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {`Studied at `}
            <Link variant="subtitle2" color="inherit">
              {info.school}
            </Link>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  const renderPostInput = (
    <Card sx={{ p: 3 }}>
      <InputBase
        multiline
        fullWidth
        rows={4}
        placeholder="Share what you are thinking here..."
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 1,
          border: (theme) => `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
        }}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
          <Fab size="small" color="inherit" variant="softExtended" onClick={handleAttach}>
            <Iconify icon="solar:gallery-wide-bold" width={24} sx={{ color: 'success.main' }} />
            Image/Video
          </Fab>

          <Fab size="small" color="inherit" variant="softExtended">
            <Iconify icon="solar:videocamera-record-bold" width={24} sx={{ color: 'error.main' }} />
            Streaming
          </Fab>
        </Stack>

        <Button variant="contained">Post</Button>
      </Stack>

      <input ref={fileRef} type="file" style={{ display: 'none' }} />
    </Card>
  );


  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Stack spacing={3}>
          {renderAbout}
        </Stack>
      </Grid>

      <Grid xs={12} md={8}>
        <Stack spacing={3}>
          {renderPostInput}
        </Stack>
      </Grid>
    </Grid>
  );
}
