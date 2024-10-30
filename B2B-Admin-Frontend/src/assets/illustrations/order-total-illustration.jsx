import { memo } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

function TotalOrderIcon({ sx, ...other }) {
  const theme = useTheme();

  const PRIMARY_MAIN = theme.vars.palette.primary.main;
  const GREY_LIGHT = theme.vars.palette.grey[300];
  const GREY_DARK = theme.vars.palette.grey[600];

  return (
    <Box
      component="svg"
      width="100%"
      height="100%"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      sx={{ width: 120, maxWidth: 1, flexShrink: 0, height: 'auto', ...sx }}
      {...other}
    >
      {/* Cart Frame */}
      <path
        d="M12 10h42l-4 20H16L12 10z"
        fill={GREY_LIGHT}
        stroke={PRIMARY_MAIN}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Handle */}
      <path
        d="M12 10H6M6 10V6"
        stroke={PRIMARY_MAIN}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Items in Cart */}
      <rect
        x="18"
        y="16"
        width="8"
        height="10"
        rx="2"
        fill={PRIMARY_MAIN}
      />
      <rect
        x="30"
        y="12"
        width="8"
        height="14"
        rx="2"
        fill={PRIMARY_MAIN}
      />
      <rect
        x="42"
        y="18"
        width="8"
        height="8"
        rx="2"
        fill={PRIMARY_MAIN}
      />

      {/* Wheels */}
      <circle cx="20" cy="50" r="5" fill={GREY_DARK} />
      <circle cx="48" cy="50" r="5" fill={GREY_DARK} />
    </Box>
  );
}

export default memo(TotalOrderIcon);
