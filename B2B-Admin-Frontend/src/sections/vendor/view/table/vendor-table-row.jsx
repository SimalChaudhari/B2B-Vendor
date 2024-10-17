import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Link as RouterLink } from 'react-router-dom'; // Import Link from react-router-dom
import { useFetchVendorData } from '../../components';

export function VendorTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {

    const confirm = useBoolean();
    const { fetchData } = useFetchVendorData();

    const popover = usePopover();

    return (
        <>
            <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
                <TableCell padding="checkbox">
                    <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell>
                    <Stack spacing={2} direction="row" alignItems="center">
                        <Avatar alt="" src="" />
                        <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                            <Link color="inherit" sx={{ cursor: 'pointer' }}>
                                {row.name}
                            </Link>
                            <Box component="span" sx={{ color: 'text.disabled' }}>
                                {row.email}
                            </Box>
                        </Stack>
                    </Stack>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.alias || 'not available'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.phone || 'not available'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.address || 'not available'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.country || 'not available'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.state || 'not available'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.pincode || 'not available'}</TableCell>

                <TableCell>
                    <Stack direction="row" alignItems="center">
                        <Tooltip title="Quick Edit" placement="top" arrow>
                            <Link
                                component={RouterLink}
                                to={`/vendors/edit/${row.id}`} // Ensure this route exists
                                sx={{ textDecoration: 'none' }}
                            >
                                <IconButton
                                    color={popover.open ? 'inherit' : 'default'}
                                    onClick={(e) => {
                                        // Prevent the default action of the link if popover should open
                                        if (popover.open) {
                                            e.preventDefault();
                                        } else {
                                            popover.onOpen(); // Ensure popover opens correctly
                                        }
                                    }}
                                >
                                    <Iconify icon="solar:pen-bold" />
                                </IconButton>
                            </Link>
                        </Tooltip>

                        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </Stack>
                </TableCell>
            </TableRow >

            <CustomPopover
                open={popover.open}
                anchorEl={popover.anchorEl}
                onClose={popover.onClose}
                slotProps={{ arrow: { placement: 'right-top' } }}
            >
                <MenuList>
                    <MenuItem
                        onClick={() => {
                            confirm.onTrue();
                            popover.onClose();
                        }}
                        sx={{ color: 'error.main' }}
                    >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        Delete
                    </MenuItem>
                    <MenuItem
                        component={RouterLink} // Set the component to Link
                        to={`/vendors/view/${row.id}`} // Set the destination URL
                        sx={{ color: 'green' }} // Keep your existing styling
                    >
                        <Iconify icon="solar:eye-bold" />
                        View
                    </MenuItem>

                </MenuList>
            </CustomPopover>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure you want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={() => {
                        onDeleteRow();
                        fetchData();
                        confirm.onFalse();
                    }}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}
