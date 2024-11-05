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
import { Tooltip } from '@mui/material';


// ----------------------------------------------------------------------

export function CheckoutCartProduct({ row, onDownload,onDelete, onDecrease, onIncrease }) {
  const isDownloadable = !!row.dimensionalFiles; // Check if pdfPath is available

  return (
    <TableRow>
      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar
            variant="rounded"
            alt={row.name}
            src={row.coverUrl}
            sx={{ width: 64, height: 64 }}
          />

          <Stack spacing={0.5}>
            <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
              {row.name}
            </Typography>

          </Stack>
        </Stack>
      </TableCell>

      <TableCell >{fCurrency(row.price)}</TableCell>

      <TableCell>
        <Box align="center">
          <IncrementerButton
            quantity={row.quantity}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            disabledDecrease={row.quantity <= 1}
            disabledIncrease={row.quantity >= row.available}
          />

        </Box>
      </TableCell>

      <TableCell align="center">{fCurrency(row.price * row.quantity)}</TableCell>
      <TableCell align="center" sx={{ px: 6 }}>
        <Tooltip title={isDownloadable ? "Download File" : "File not available"}>
          <span> {/* Wrap in span to allow tooltip on disabled button */}
            <IconButton
              onClick={() => isDownloadable && onDownload(row.id)}
              sx={{ color: 'primary.main' }}
              disabled={!isDownloadable} // Disable if no pdfPath
            >
              <Iconify icon="eva:download-outline" />
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>

      <TableCell align="center" sx={{ px: 1 }}>
        <IconButton onClick={onDelete} sx={{ color: 'error.main' }}> {/* Use error color */}
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </TableCell>

    </TableRow>
  );
}
