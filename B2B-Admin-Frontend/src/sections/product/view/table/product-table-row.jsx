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
import { ProductViewDialog } from '../product-view';

import { useState } from 'react';
import { ProductEditForm } from '../product-edit-form';
import { useFetchProductData } from '../../components/fetch-product';
import { ListItemText } from '@mui/material';

// ----------------------------------------------------------------------

export function ProductTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {

    const confirm = useBoolean();
    const { fetchData } = useFetchProductData(); // Destructure fetchData from the custom hoo

    const popover = usePopover();

    const quickEdit = useBoolean();
    const quickView = useBoolean();
    const quickAdd = useBoolean();


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
                <Stack direction="row" alignItems="center" >
                        <Avatar    variant="rounded" alt={row?.imageUrl} src={row?.name} sx={{ width: 60, height: 60, mr: 2 }} />
                        <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                            <Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
                                {row.itemName || 'not available'}
                            </Link>
                        </Stack>
                    </Stack>
                </TableCell>

                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {row.group || 'not available'}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {row.category || 'not available'}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {row.costPrice || 'not available'}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {row.sellingPrice || 'not available'}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {row.mrpRate || 'not available'}
                </TableCell>

                <TableCell>
                    <Stack direction="row" alignItems="center">
                        <Tooltip title="Quick Edit" placement="top" arrow>
                            <IconButton
                                color={quickEdit.value ? 'inherit' : 'default'}
                                onClick={quickEdit.onTrue}
                            >
                                <Iconify icon="solar:pen-bold" />
                            </IconButton>
                        </Tooltip>

                        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </Stack>
                </TableCell>
            </TableRow>


            <ProductEditForm open={quickEdit.value} onClose={quickEdit.onFalse} productData={row} />
            <ProductViewDialog open={quickView.value} onClose={quickView.onFalse} productView={row} />

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
                        color={quickEdit.value ? 'inherit' : 'default'}
                        onClick={quickView.onTrue}
                        sx={{ color: 'green' }}
                    >
                        <Iconify icon="solar:eye-bold" /> {/* Example new icon for view */}
                        View
                    </MenuItem>
                </MenuList>
            </CustomPopover>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={() => {
                        onDeleteRow();  // Perform the delete action
                        fetchData()
                        confirm.onFalse();  // Close the dialog after deletion
                    }}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    );
}
