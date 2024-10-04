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
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
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
import { applyFilter } from '../utils';
import { useFetchCategoryData } from '../components';
import { CategoryTableRow } from './table/category-table-row';
import { CategoryTableToolbar } from './table/category-table-toolbar';
import { CategoryTableFiltersResult } from './table/category-table-filters-result';
import { CategoryForm} from './category-form';
import { TABLE_CATEGORY_HEAD, getCategoryStatusOptions } from 'src/components/constants';

export function CategoryListView() {
  const table = useTable();
  const confirm = useBoolean();
  const dispatch = useDispatch();

  // Fetching category data from Redux
  const { fetchData, fetchDeleteData } = useFetchCategoryData();
  const _categoryList = useSelector((state) => state.category?.category || []);

  // Local state for managing table data and selected category
  const [tableData, setTableData] = useState(_categoryList);
  const [selectedCategory, setSelectedCategory] = useState(null); // For handling category edit

  const STATUS_OPTIONS = getCategoryStatusOptions(tableData);

  // State for handling dialog open/close
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setSelectedCategory(null); // Reset selected category on dialog close
    setOpenDialog(false);
  };

  // Filters state
  const filters = useSetState({ name: '', description: '', status: 'all' });

  // Fetch categories on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Update table data when category list changes
  useEffect(() => {
    setTableData(_categoryList);
  }, [_categoryList]);

  // Filtered data and pagination logic
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const canReset = !!filters.state.name || !!filters.state.description || filters.state.status !== 'all';
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  // Handle category edit
  const handleEditRow = useCallback((category) => {
    setSelectedCategory(category); // Set the selected category for editing
    setOpenDialog(true); // Open the dialog for editing
  }, []);

  // Handle delete of selected rows
  const handleDeleteRows = useCallback((id) => fetchDeleteData(id), []);

  // Delete a single row
  const handleDeleteRow = useCallback((id) => fetchDeleteData(id), []);

  // Handle status filter
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  return (
    <>
      <DashboardContent maxWidth="2xl">
        <CustomBreadcrumbs
          heading="Categories"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Categories', href: paths?.dashboard?.categories?.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              onClick={handleOpenDialog}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Category
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <CategoryForm open={openDialog} onClose={handleCloseDialog} categoryData={selectedCategory} />

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

          <CategoryTableToolbar filters={filters} onResetPage={table.onResetPage} />

          {canReset && (
            <CategoryTableFiltersResult
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
                table.onSelectAllRows(checked, dataFiltered.map((row) => row.id))
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
                  headLabel={TABLE_CATEGORY_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(checked, dataFiltered.map((row) => row.id))
                  }
                />

                <TableBody>
                  {dataFiltered.slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  ).map((row) => (
                    <CategoryTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row)}
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
            onRowsPerPageChange={table.onRowsPerPageChange}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Category?"
        content={
          <Box>
            <Typography gutterBottom>Are you sure you want to delete the selected category?</Typography>
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
