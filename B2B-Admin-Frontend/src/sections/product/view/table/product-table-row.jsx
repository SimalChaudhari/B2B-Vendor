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
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { useState } from 'react';
import { useFetchProductData } from '../../components/fetch-product';
import { Link as RouterLink } from 'react-router-dom'; // Import Link from react-router-dom

const imageURL = "https://t3.ftcdn.net/jpg/06/12/00/18/360_F_612001823_TkzT0xmIgagoDCyQ0yuJYEGu8j6VNVYT.jpg"

export function ProductTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
   
    const confirm = useBoolean();
    const { fetchData } = useFetchProductData();

    const popover = usePopover();
    const quickEdit = useBoolean();
    const quickView = useBoolean();
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <>
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
                            <Link component={RouterLink} to={`/edit/${row.id}`} color="inherit" sx={{ cursor: 'pointer' }}>
                                {row.itemName}
                            </Link>
                            <Box component="span" sx={{ color: 'text.disabled' }}>
                                {row.group}
                            </Box>
                        </Stack>
                    </Stack>
                </TableCell>

                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.group || 'not available'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.subGroup1 || 'not available'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.subGroup2 || 'not available'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.description || 'not available'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.sellingPrice ? `₹${row.sellingPrice}` : 'not available'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.sellingPriceDate || 'not available'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.gstRate || 'not available'}</TableCell>

                <TableCell>
                    <Stack direction="row" alignItems="center">
                        <Tooltip title="Quick Edit" placement="top" arrow>
                            <Link component={RouterLink} to={`/products/edit/${row.id}`} sx={{ textDecoration: 'none' }}>
                                <IconButton>
                                    <Iconify icon="solar:pen-bold" />
                                </IconButton>
                            </Link>
                        </Tooltip>

                        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </Stack>
                </TableCell>
            </TableRow>

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
                        to={`/products/view/${row.id}`} // Set the destination URL
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
