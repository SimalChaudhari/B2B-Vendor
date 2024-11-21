import React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import { fDate, fTime } from 'src/utils/format-time';
import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function LogTableRow({ row, selected, onSelectRow }) {
  return (
    <TableRow hover selected={selected}>
    <TableCell padding="checkbox">
      <Checkbox
        checked={selected}
        onClick={onSelectRow}
        inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': 'Row checkbox' }}
      />
    </TableCell>

    {/* Sync Type */}
    <TableCell align="center">
      <Link color="inherit" sx={{ cursor: 'pointer' }}>
        {row.sync_type || 'N/A'}
      </Link>
    </TableCell>

    {/* Total Count */}
    <TableCell align="center">{row.total_count || 0}</TableCell>

    {/* Success Count */}
    <TableCell align="center">{row.success_count || 0}</TableCell>

    {/* Failed Count */}
    <TableCell align="center">{row.failed_count || 0}</TableCell>

    {/* Sync Date */}
    <TableCell>
      <ListItemText
        primary={fDate(row.created_at) || 'N/A'}
        secondary={fTime(row.created_at) || ''}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        secondaryTypographyProps={{
          mt: 0.5,
          component: 'span',
          typography: 'caption',
        }}
      />
    </TableCell>

    {/* Status */}
    <TableCell>
      <Label
        variant="soft"
        color={
          (row.status === 'success' && 'success') ||
          (row.status === 'fail' && 'error') ||
          'default'
        }
      >
        {row.status || 'N/A'}
      </Label>
    </TableCell>
  </TableRow>
  );
}
