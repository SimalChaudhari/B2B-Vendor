import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { DashboardContent } from 'src/layouts/dashboard';
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
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { applyFilterAddress } from '../../utils';
import { useFetchAddressData } from '../../components';
import { AddressCreateForm } from './user-create-address-form';
import { TABLE_ADDRESS_HEAD } from '../../constants';
import { AddressTableToolbar } from './address-table-toolbar';
import { AddressTableFiltersResult } from './address-table-filters-result';
import { AddressTableRow } from './address-table-row';

// ----------------------------------------------------------------------
export function AddressListView() {
  const table = useTable();
  const router = useRouter();
  const confirm = useBoolean();

  const { fetchData, fetchDeleteData } = useFetchAddressData(); // Destructure fetchData from the custom hook

  const _addressList = useSelector((state) => state.address?.address || []);
  const [tableData, setTableData] = useState(_addressList);

  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Update the initial state to include lastName, email, and mobile
  const filters = useSetState({ street_address: '', city: '', state: '', zip_code: '', country: '' });
  //----------------------------------------------------------------------------------------------------
  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, []);

  useEffect(() => {
    setTableData(_addressList);
  }, [_addressList]);
  //----------------------------------------------------------------------------------------------------

  const dataFiltered = applyFilterAddress({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const canReset = !!filters.state.searchTerm 
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  //----------------------------------------------------------------------------------------------------

  const handleDeleteRows = useCallback((id) => {
    fetchDeleteData(id)
  },
    []
  );

  const handleDeleteRow = useCallback((id) => {
    fetchDeleteData(id)
  },
    []
  );

  const handleEditRow = useCallback(
    (id) => id, // Directly return the id
    [] // Add any dependencies here if necessary
  );

  const handleViewRow = useCallback(
    (id) => id, // Directly return the id
    [] // Add any dependencies here if necessary
  );


  //----------------------------------------------------------------------------------------------------

  return (
    <>
      <DashboardContent maxWidth="2xl">
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Addresses', href: paths?.dashboard?.address?.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              // href={paths?.dashboard?.user?.new}
              onClick={handleOpenDialog} // Open the dialog on click
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Address
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <AddressCreateForm open={openDialog} onClose={handleCloseDialog} />

        

        <Card>
     
          <AddressTableToolbar filters={filters} onResetPage={table.onResetPage} />
          {canReset && (
            <AddressTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_ADDRESS_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered.slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  ).map((row) => (
                    <AddressTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete addresses?"
        content={
          <Box>
            <Typography gutterBottom>Are you sure you want to delete the selected addresses?</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              This action cannot be undone.
            </Typography>
          </Box>
        }
        action={
          <Button onClick={handleDeleteRows} variant="contained" color="error">
            Delete
          </Button>
        }
      />
    </>
  );
}

