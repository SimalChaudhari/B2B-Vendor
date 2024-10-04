import {
  Box,
  Link,
  Stack,
  Button,
  Avatar,
  Tooltip,
  MenuList,
  MenuItem,
  TableRow,
  Checkbox,
  TableCell,
  IconButton,
  Collapse,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableContainer,
  Paper
} from '@mui/material';
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

export function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const confirm = useBoolean();
  const { fetchData } = useFetchUserData(); // Destructure fetchData from the custom hook
  const popover = usePopover();
  const quickEdit = useBoolean(); // Boolean state for quick edit (opens UserForm)
  const quickView = useBoolean(); // Boolean state for quick view (opens UserViewDialog)
  const [openDialog, setOpenDialog] = useState(false); // Boolean for address dialog
  const [openDetails, setOpenDetails] = useState(false); // State to track details expansion

  // Open and close dialogs
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleToggleDetails = () => setOpenDetails(!openDetails); // Toggle the detailed view

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
          <Stack direction="row" alignItems="center" spacing={1}>
            {/* Button to expand/collapse additional details */}
            <IconButton onClick={handleToggleDetails}>
              <Iconify icon={openDetails ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} />
            </IconButton>

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

      {/* Expanded Details Row */}
      <TableRow>
        <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={openDetails} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="h6" gutterBottom component="div">
                Addresses
              </Typography>
              {/* Render addresses in table format */}
              {row.addresses && row.addresses.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="addresses">
                    <TableHead>
                      <TableRow>
                        <TableCell>Street Address</TableCell>
                        <TableCell>City</TableCell>
                        <TableCell>State</TableCell>
                        <TableCell>Zip Code</TableCell>
                        <TableCell>Country</TableCell>
                        <TableCell>Created At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.addresses.map((address) => (
                        <TableRow key={address.id}>
                          <TableCell>{address.street_address}</TableCell>
                          <TableCell>{address.city}</TableCell>
                          <TableCell>{address.state}</TableCell>
                          <TableCell>{address.zip_code}</TableCell>
                          <TableCell>{address.country}</TableCell>
                          <TableCell>{new Date(address.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2">No addresses available</Typography>
              )}
            </Box>
          </Collapse>
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
