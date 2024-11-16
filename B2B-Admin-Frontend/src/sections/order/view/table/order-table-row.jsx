import React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { useBoolean } from 'src/hooks/use-boolean';
import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { RouterLink } from 'src/routes/components';
import { Typography } from '@mui/material';
import useUserRole from 'src/layouts/components/user-role';

// ----------------------------------------------------------------------

export function OrderTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }) {

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const userRole = useUserRole();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `Row checkbox` }}
        />
      </TableCell>
      <TableCell align="center"> {row?.orderNo || "N/A"} </TableCell>
      {userRole === "Admin" &&
        <>
          <TableCell>
            <Stack spacing={2} direction="row" alignItems="center">
              <Avatar alt={row?.user?.name} src={row?.user?.name} />
              <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                <Link color="inherit" sx={{ cursor: 'pointer' }}>
                  {row?.user?.name}
                </Link>
                <Box component="span" sx={{ color: 'text.disabled' }}>
                  {row?.user?.email}
                </Box>
              </Stack>
            </Stack>
          </TableCell>
          <TableCell align="center"> {row?.user.mobile || "N/A"} </TableCell>
        </>
      }
      <TableCell align="center"> {row?.totalQuantity} </TableCell>

      <TableCell> {fCurrency(row.totalPrice)} </TableCell>
      <TableCell> {`${row.discount}%`} </TableCell>
      <TableCell> {fCurrency(row.finalAmount)} </TableCell>

      <TableCell> {row.delivery} </TableCell>
      <TableCell>
        <ListItemText
          primary={fDate(row.createdAt)}
          secondary={fTime(row.createdAt)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>


      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'completed' && 'success') ||
            (row.status === 'pending' && 'warning') ||
            (row.status === 'cancelled' && 'error') ||
            'default'
          }
        >
          {row?.status}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{ ...(collapse.value && { bgcolor: 'action.hover' }) }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Paper sx={{ m: 1.5 }}>
            {row.orderItems.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                alignItems="center"
                sx={{
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: (theme) => `solid 2px ${theme.vars.palette.background.neutral}`,
                  },
                }}
              >
                <Avatar
                  src={item.product.productImages?.[0]}
                  variant="rounded"
                  sx={{ width: 48, height: 48, mr: 2 }}
                />
                <ListItemText
                  primary={item.product.itemName}
                  secondary={item.product.alias}
                  primaryTypographyProps={{ typography: 'body2' }}
                  secondaryTypographyProps={{
                    component: 'span',
                    color: 'text.disabled',
                    mt: 0.5,
                  }}
                />
                <Box sx={{ width: 130, textAlign: 'right', margin: 2 }}>
                  <Typography variant="body2" color="text.primary">
                    {`Original Price: ${fCurrency(item.product.sellingPrice)}`}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ width: 30, textAlign: 'center' }}>
                  x {item.quantity}
                </Typography>
                <Box sx={{ width: 130, textAlign: 'right' }}>
                  <Typography variant="body2" color="text.primary">
                    {fCurrency(item.product.sellingPrice * item.quantity)}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

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
            to={`/orders/details/${row.id}`} // Set the destination URL
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
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
