import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Link as RouterLink } from 'react-router-dom'; // Import Link from react-router-dom
import { Checkbox } from '@mui/material';


export function StockTableRow({ row, selected, onSelectRow }) {

    return (

        <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
            <TableCell padding="checkbox">
                <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
            </TableCell>
            <TableCell>
                <Stack direction="row" alignItems="center">
                    <Avatar
                        variant="rounded"
                        alt={row.productImages}
                        src={row.productImages ? row?.productImages?.[0] : "No File"} // Get the first image link and trim whitespace
                        sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                        <Link
                            component={RouterLink}
                            to={`/products/edit/${row.id}`}
                            color="inherit"
                            sx={{ cursor: 'pointer' }}
                        >
                            {row.itemName}
                        </Link>

                        <Box component="span" sx={{ color: 'text.disabled' }}>
                            {row.group}
                        </Box>
                    </Stack>
                </Stack>
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.subGroup1 || 'not available'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.subGroup2 || 'not available'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.quantity || 'not available'}</TableCell>
          
        </TableRow >

    );
}
