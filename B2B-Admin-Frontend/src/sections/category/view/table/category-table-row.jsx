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
import { CategoryViewDialog } from '../category-list';
import { useFetchCategoryData } from '../../components';
import { CategoryForm } from '../category-form';

// ----------------------------------------------------------------------

export function CategoryTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const confirm = useBoolean(); // Manage delete confirmation state
  const { fetchData } = useFetchCategoryData(); // Fetch category data
  const popover = usePopover(); // For handling more actions popover
  const quickEdit = useBoolean(); // Boolean state for quick edit
  const quickView = useBoolean(); // Boolean state for viewing category details

  // Open and close dialogs for creating categories
  const [openDialog, setOpenDialog] = useState(false);
  
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>
          {row.description}
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'Active' && 'success') ||
              (row.status === 'Inactive' && 'error') ||
              'default'
            }
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

      {/* Category Edit Form */}
      <CategoryForm open={quickEdit.value} onClose={quickEdit.onFalse} categoryData={row} />

      {/* Category View Dialog */}
      <CategoryViewDialog open={quickView.value} onClose={quickView.onFalse} categoryView={row} />

      {/* Category Create Form */}
      <CategoryForm open={openDialog} onClose={handleCloseDialog} />

      {/* Popover for More Actions */}
      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuList>
          {/* Delete Action */}
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

          {/* View Action */}
          <MenuItem
            color={quickEdit.value ? 'inherit' : 'default'}
            onClick={quickView.onTrue}
            sx={{ color: 'green' }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
        </MenuList>
      </CustomPopover>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Category"
        content="Are you sure you want to delete this category?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();  // Perform delete action
              fetchData();  // Fetch updated data
              confirm.onFalse();  // Close confirmation dialog after deletion
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
