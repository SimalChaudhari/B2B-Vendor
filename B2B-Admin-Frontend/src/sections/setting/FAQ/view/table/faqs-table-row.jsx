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
import { Link as RouterLink } from 'react-router-dom'; // Import Link from react-router-dom
import { useFetchFAQData } from '../../components/fetch-FAQ';


export function FAQTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
    // console.log("🚀 ~ FAQTableRow ~ row:", row)
    const confirm = useBoolean();
    const { fetchFAQData } = useFetchFAQData();

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

                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.question || 'not available'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.answer || 'not available'}</TableCell>

                <TableCell>
                    <Label
                        variant="soft"
                        color={(row.status === 'Active' && 'success') || (row.status === 'Inactive' && 'error') || 'default'}
                    >
                        {row.status}
                    </Label>
                </TableCell>
                <TableCell>
                    <Stack direction="row" alignItems="center">
                        <Tooltip title="Quick Edit" placement="top" arrow>
                            <Link component={RouterLink} to={`/settings/faq/edit/${row.id}`} sx={{ textDecoration: 'none' }}>
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
                        to={`/settings/faq/view/${row.id}`} // Set the destination URL
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
                        fetchFAQData();
                        confirm.onFalse();
                    }}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}
