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
import { useFetchContactData } from '../../components/fetch-contact';


export function ContactTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
    const confirm = useBoolean();
    const { fetchContactData } = useFetchContactData();

    const popover = usePopover();


    return (
        <>
            <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
                <TableCell padding="checkbox">
                    <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '200px', // Set a width that fits your layout
                }}>
                    {row.name || 'not available'}
                </TableCell>

                <TableCell sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '200px', // Set a width that fits your layout
                }}>
                    {row.email || 'not available'}
                </TableCell>

                <TableCell
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '200px', // Set a width that fits your layout
                    }}
                    dangerouslySetInnerHTML={{ __html: row.message || 'not available' }} // Render HTML content
                />

                <TableCell>
                    <Stack direction="row" alignItems="center">
                        <Tooltip title="Quick Edit" placement="top" arrow>
                            <Link component={RouterLink} to={`/settings/contact-us/edit/${row.id}`} sx={{ textDecoration: 'none' }}>
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
                        to={`/settings/contact-us/view/${row.id}`} // Set the destination URL
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
                        fetchContactData();
                        confirm.onFalse();
                    }}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}
