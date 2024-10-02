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


import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
// import { getStatusOptions, TABLE_CATEGORY_HEAD } from './../../user/constants/tableHead';
import { applyFilter } from '../utils';
import { SubCategoryTableRow } from './table/subcategory-table-row';
import { SubCategoryTableToolbar } from './table/subcategory-table-toolbar';
import { SubCategoryTableFiltersResult } from './table/subcategory-table-filters-result';
import { SubCategoryCreateForm } from './subcategory-create-form';
import { TABLE_SUB_CATEGORY_HEAD, getSubCategoryStatusOptions } from 'src/components/constants';
import { useFetchSubCategoryData } from '../components/fetch-sub-category';

// ----------------------------------------------------------------------
export function SubCategoryListView() {

  const table = useTable();
  const router = useRouter();
  const confirm = useBoolean();

  const { fetchData, fetchDeleteData } = useFetchSubCategoryData(); // Destructure fetchData from the custom hook

  const _subcategoryList = useSelector((state) => state.subcategory?.subcategory || []);
  const [tableData, setTableData] = useState(_subcategoryList);

  const STATUS_OPTIONS = getSubCategoryStatusOptions(tableData);

  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => { setOpenDialog(true) };
  const handleCloseDialog = () => { setOpenDialog(false) };

  // Update the initial state to include lastName, email, and mobile
  const filters = useSetState({ name: '', categoryId: '', description: '', status: 'all' });
  //----------------------------------------------------------------------------------------------------
  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, []);

  useEffect(() => {
    setTableData(_subcategoryList);
  }, [_subcategoryList]);
  //----------------------------------------------------------------------------------------------------

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const canReset = !!filters.state.searchTerm || filters.state.status !== 'all';
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  //----------------------------------------------------------------------------------------------------

  const handleDeleteRows = useCallback((id) => { fetchDeleteData(id) }, []);

  const handleDeleteRow = useCallback((id) => { fetchDeleteData(id) }, []);

  const handleEditRow = useCallback((id) => id, []);

  const handleViewRow = useCallback((id) => id, []);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );
  //----------------------------------------------------------------------------------------------------

  return (
    <>
      <DashboardContent maxWidth="2xl">
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'SubCategory', href: paths?.dashboard?.subcategory?.root },
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
              New Sub-Category
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <SubCategoryCreateForm open={openDialog} onClose={handleCloseDialog} />
        <Card>
          <Tabs value={filters.state.status} onChange={handleFilterStatus}
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
                    variant={tab.value === filters.state.status ? 'filled' : 'soft'}
                    color={
                      (tab.value === 'Active' && 'success') ||
                      (tab.value === 'Inactive' && 'error') ||
                      (tab.value === 'all' && 'default') || 'default'
                    }
                  >
                    {tab.count} {/* Display the count for each status */}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <SubCategoryTableToolbar filters={filters} onResetPage={table.onResetPage} />
          {canReset && (
            <SubCategoryTableFiltersResult
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
                  headLabel={TABLE_SUB_CATEGORY_HEAD}
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
                    <SubCategoryTableRow
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
        title="Delete Category?"
        content={
          <Box>
            <Typography gutterBottom>Are you sure you want to delete the selected Sub Category?</Typography>
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

