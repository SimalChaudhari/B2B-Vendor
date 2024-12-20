import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

import { IncrementerButton } from '../product/components/incrementer-button';

// ----------------------------------------------------------------------

export function CheckoutCartProduct({ row, onDelete, onDecrease, onIncrease }) {
  return (
    <TableRow>
      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar
            variant="rounded"
            alt={row.name}
            src={row.productImages?.[0]}
            sx={{ width: 64, height: 64 }}
          />

          <Stack spacing={0.5}>
            <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
              {row.itemName}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              sx={{ typography: 'body2', color: 'text.secondary' }}
            >
            {/*
              size: <Label sx={{ ml: 0.5 }}> {row.size} </Label>
              <Divider orientation="vertical" sx={{ mx: 1, height: 16 }} />
                <ColorPreview colors={row.colors} />
                */}
            </Stack>
          </Stack>
        </Stack>
      </TableCell>

      <TableCell>{fCurrency(row.sellingPrice)}</TableCell>

      <TableCell>
        <Box sx={{ width: 88, textAlign: 'right' }}>
          <IncrementerButton
            quantity={row.quantity}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            disabledDecrease={row.quantity <= 1}
            // disabledIncrease={row.quantity >= row.available}
          />

          {/*
            <Typography variant="caption" component="div" sx={{ color: 'text.secondary', mt: 1 }}>
              available: {row.available}
            </Typography>
          */}
        </Box>
      </TableCell>

      <TableCell align="right">{fCurrency(row.sellingPrice * row.quantity)}</TableCell>

      <TableCell align="right" sx={{ px: 1 }}>
        <IconButton onClick={onDelete}>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
