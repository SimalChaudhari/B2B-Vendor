import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { OrderTableRow } from './table/order-table-row';
import { OrderTableToolbar } from '../order-table-toolbar';
import { OrderTableFiltersResult } from './table/order-table-filters-result';
import { ORDER_STATUS_OPTIONS } from 'src/_mock/_order';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchOrderData } from '../components/fetch-order';
import useUserRole from 'src/layouts/components/user-role';
import { syncOrder } from 'src/store/action/orderActions';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...ORDER_STATUS_OPTIONS];

// ----------------------------------------------------------------------

export function OrderListView() {
  const table = useTable();
  const confirm = useBoolean();
  const userRole = useUserRole();
  const [selectedRows, setSelectedRows] = useState([]); // Store selected row IDs



  const { fetchData, fetchDeleteData } = useFetchOrderData(); // Destructure fetchData from the custom hook
  const dispatch = useDispatch();
  const confirmSync = useBoolean(); // Separate confirmation state for syncing

  const [loading, setLoading] = useState(false);
  const _orders = useSelector((state) =>
    userRole === 'Admin' ? state.order?.order || [] : state.order?.order?.orders || []
  );
  const [tableData, setTableData] = useState(_orders);
  const filters = useSetState({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);
  //-----------------------------------------------------------------------------------------------------

  const TABLE_HEAD = [
    { id: 'OrderNo', label: 'Order No', align: 'center' }, // Always present
    ...(userRole === "Admin"
      ? [
        { id: 'Customer', label: 'Customer' },
        { id: 'Mobile', label: 'Mobile', align: 'center' },
      ]
      : []),
    { id: 'Quantity', label: 'Total Quantity', align: 'center' },
    { id: 'Amount', label: 'Total Price' },
    { id: 'Delivery', label: 'Delivery Type' },
    { id: 'createdAt', label: 'Order Date' },
    { id: 'status', label: 'Status' },
    { id: '', width: 88 },
  ];


  //----------------------------------------------------------------------------------------------------
  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, []);

  useEffect(() => {
    setTableData(_orders);
  }, [_orders]);
  //----------------------------------------------------------------------------------------------------



  const handleSelectRow = useCallback((id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  }, []);

  const handleDeleteSelectedRows = useCallback(() => {
    selectedRows.forEach((id) => fetchDeleteData(id));
    setSelectedRows([]);
    fetchData(); // Refresh data after deletion
    confirm.onFalse();
  }, [selectedRows, fetchDeleteData, fetchData]);

  //----------------------------------------------------------------------------------------------------
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
    userRole, // Add userRole here
  });

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
  //----------------------------------------------------
  const handleDeleteRow = useCallback((id) => { fetchDeleteData(id) }, []);

  const handleViewRow = useCallback((id) => id, []);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const handleSyncAPI = async () => {
    setLoading(true); // Set loading to true
    try {
      await dispatch(syncOrder());
      fetchData(); // Fetch data after syncing
    } catch (error) {
      console.error('Error syncing order invoice:', error);
    } finally {
      setLoading(false); // Set loading to false after the API call completes
      confirmSync.onFalse(); // Close the confirmation dialog

    }
  };


  //--------------------------------------------------
  return (
    <div>
      <DashboardContent maxWidth="2xl">
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Order', href: paths?.dashboard?.order?.root },
            { name: 'List' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}

          action={
            userRole === 'Admin' && ( // Only show the button for Vendor role
              <Button
                onClick={confirmSync.onTrue} // Open the sync confirmation dialog
                variant="contained"
                startIcon={<Iconify icon="eva:sync-fill" />}
                disabled={loading}
              >
                {loading ? 'Syncing...' : 'Sync Invoices'}
              </Button>
            )
          }
        />

        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'completed' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'cancelled' && 'error') ||
                      'default'
                    }
                  >
                    {['completed', 'pending', 'cancelled'].includes(tab.value)
                      ? tableData.filter((user) => user.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <OrderTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            dateError={dateError}
          />

          {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={selectedRows.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) => setSelectedRows(checked ? dataFiltered.map(row => row.id) : [])}

              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar sx={{ minHeight: 444 }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={selectedRows.length}

                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    setSelectedRows(checked ? dataFiltered.map((row) => row.id) : [])
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <OrderTableRow
                        key={row.id}
                        row={row}
                        selected={selectedRows.includes(row.id)}
                        onSelectRow={() => handleSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      {/* Sync Confirmation Dialog */}
      <ConfirmDialog
        open={confirmSync.value}
        onClose={confirmSync.onFalse}
        content={
          <Box>
            <Typography gutterBottom>Are you sure you want to sync the Invoices?</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              This action will update the Invoices data and may take a few moments.
            </Typography>
          </Box>
        }
        action={
          <Button
            onClick={handleSyncAPI} // Trigger sync API call on confirmation
            variant="contained"
            color="primary"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Syncing...' : 'Confirm Sync'}
          </Button>
        }
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Orders?"
        content={
          <Box>
            <Typography gutterBottom>Are you sure you want to delete the selected Orders?</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              This action cannot be undone.
            </Typography>
          </Box>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteSelectedRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </div>
  );
}

function applyFilter({ inputData, comparator, filters, dateError, userRole }) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((order) =>
      userRole === "Admin"
        ? order.user.name.toLowerCase().includes(name.toLowerCase()) ||
        order.user.email.toLowerCase().includes(name.toLowerCase()) ||
        order.user.mobile.toLowerCase().includes(name.toLowerCase()) ||
        order.totalPrice.toString().includes(name.toLowerCase()) ||
        order.totalQuantity.toString().includes(name.toLowerCase())
        : order.totalPrice.toString().includes(name.toLowerCase()) ||
        order.totalQuantity.toString().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  if (!dateError && startDate && endDate) {
    inputData = inputData.filter((order) =>
      fIsBetween(order.createdAt, startDate, endDate)
    );
  }

  return inputData;
}
