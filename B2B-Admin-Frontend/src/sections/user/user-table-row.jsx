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

import { UserForm } from './view/user-form';  // Use the unified form for add/edit
import { UserViewDialog } from './view/user-view';
import { useFetchUserData } from './components';
import { AddressCreateForm } from './address/user-create-address-form';

// ----------------------------------------------------------------------

export function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const confirm = useBoolean();
  const { fetchData } = useFetchUserData(); // Destructure fetchData from the custom hook
  const popover = usePopover();
  const quickEdit = useBoolean(); // Boolean state for quick edit (opens UserForm)
  const quickView = useBoolean(); // Boolean state for quick view (opens UserViewDialog)
  const [openDialog, setOpenDialog] = useState(false); // Boolean for address dialog

  // Open and close dialogs
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row.profile} src={row.avatarUrl} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link color="inherit" onClick={quickEdit.onTrue} sx={{ cursor: 'pointer' }}>
                {row.firstName} {row.lastName}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.email}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.mobile}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.role}</TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={(row.status === 'Active' && 'success') || (row.status === 'Suspended' && 'error') || 'default'}
          >
            {row.status}
          </Label>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center">
            <Tooltip title="Quick Edit" placement="top" arrow>
              <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      {/* UserForm for Editing */}
      <UserForm open={quickEdit.value} onClose={quickEdit.onFalse} userData={row} /> {/* Using UserForm for editing */}

      {/* UserViewDialog for Viewing */}
      <UserViewDialog open={quickView.value} onClose={quickView.onFalse} userView={row} />

      {/* Address Form Dialog */}
      <AddressCreateForm open={openDialog} onClose={handleCloseDialog} />

      {/* Custom Popover for Additional Actions */}
      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose} slotProps={{ arrow: { placement: 'right-top' } }}>
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
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>

          <MenuItem
            color={quickEdit.value ? 'inherit' : 'default'}
            onClick={handleOpenDialog} // Open the address dialog
          >
            <Iconify icon="mdi:map-marker-outline" />
            Address
          </MenuItem>
        </MenuList>
      </CustomPopover>

      {/* Confirm Dialog for Delete */}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow(); // Perform the delete action
              fetchData(); // Fetch updated data
              confirm.onFalse(); // Close the dialog after deletion
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
