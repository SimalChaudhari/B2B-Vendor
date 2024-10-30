import { memo } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

function SuccessOrderIcon({ sx, ...other }) {
  const theme = useTheme();

  const PRIMARY_MAIN = theme.vars.palette.primary.main;
  const PRIMARY_LIGHT = theme.vars.palette.primary.light;
  const SUCCESS_MAIN = theme.vars.palette.success.main;
  const SUCCESS_LIGHT = theme.vars.palette.success.light;

  return (
    <Box
      component="svg"
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      sx={{ width: 120, maxWidth: 1, flexShrink: 0, height: 'auto', ...sx }}
      {...other}
    >
      <circle
        cx="100"
        cy="100"
        r="95"
        fill={SUCCESS_LIGHT}
        stroke={SUCCESS_MAIN}
        strokeWidth="10"
      />

      <path
        d="M70 105l20 20 40-50"
        fill="none"
        stroke={PRIMARY_MAIN}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}

export default memo(SuccessOrderIcon);
