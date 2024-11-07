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
import { ProductTableFiltersResult } from './table/product-table-filters-result';
import { useDispatch, useSelector } from 'react-redux';
import { syncProduct } from 'src/store/action/productActions';
import { Typography } from '@mui/material';
import { getProductStatusOptions, TABLE_PRODUCT_HEAD } from '../../../components/constants';

import { applyFilter } from '../utils';
import { ProductTableRow } from './table/product-table-row';
import { ProductTableToolbar } from './table/product-table-toolbar';
import { useFetchProductData } from '../components/fetch-product';

// ----------------------------------------------------------------------
export function ProductListView() {
    const table = useTable();
    const router = useRouter();
    const confirm = useBoolean();
    const [loading, setLoading] = useState(false);
    const { fetchData, fetchDeleteData, fetchDeleteItem } = useFetchProductData(); // Destructure fetchData from the custom hook
    const dispatch = useDispatch();
    const _productList = useSelector((state) => state.product?.product || []);

    const options = _productList.map(opt => ({
        group: opt.group,
        subGroup1: opt.subGroup1,
        subGroup2: opt.subGroup2,

    }));

    const [tableData, setTableData] = useState(_productList);
    const STATUS_OPTIONS = getProductStatusOptions(tableData);
    // Update the initial state to include lastName, email, and mobile
    const filters = useSetState({ searchTerm: '', itemName: '', group: '', subGroup1: '', subGroup2: '', status: 'all' });

    //----------------------------------------------------------------------------------------------------
    useEffect(() => {
        fetchData(); // Call fetchData when the component mounts
    }, []);

    useEffect(() => {
        setTableData(_productList);
    }, [_productList]);
    //----------------------------------------------------------------------------------------------------

    // Clear specific group
    const onClearGroup = useCallback((group) => {
        filters.setState((prevState) => ({
            ...prevState,
            group: prevState.group.filter((g) => g !== group)
        }));
    }, [filters]);

    // Clear specific subGroup1
    const onClearSubGroup1 = useCallback((subGroup1) => {
        filters.setState((prevState) => ({
            ...prevState,
            subGroup1: prevState.subGroup1.filter((sub1) => sub1 !== subGroup1)
        }));
    }, [filters]);

    // Clear specific subGroup2
    const onClearSubGroup2 = useCallback((subGroup2) => {
        filters.setState((prevState) => ({
            ...prevState,
            subGroup2: prevState.subGroup2.filter((sub2) => sub2 !== subGroup2)
        }));
    }, [filters]);





    //-----------------------------------------------------------------

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: filters.state,
    });

    const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
    const canReset = !!filters.state.searchTerm || filters.state.group || filters.state.subGroup1 || filters.state.subGroup2 || filters.state.status !== 'all';
    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    //----------------------------------------------------------------------------------------------------

    const handleDeleteRows = useCallback((id) => { fetchDeleteData(id) }, []);

    const handleDeleteRow = useCallback((id) => { fetchDeleteItem(id) }, []);

    const handleEditRow = useCallback((id) => id, []);

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
        const res = await dispatch(syncProduct());
        if (res) {
            fetchData(); // Fetch data after syncing

        }
        setLoading(false); // Set loading to false after the API call completes
    };

    //----------------------------------------------------------------------------------------------------

    return (
        <>
            <DashboardContent maxWidth="2xl">
                <CustomBreadcrumbs
                    heading="List"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'Products', href: paths?.dashboard?.product?.root },
                        { name: 'List' },
                    ]}
                    action={
                        <Button
                            // href={paths?.dashboard?.user?.new}
                            onClick={handleSyncAPI} // Open the dialog on click
                            variant="contained"
                            startIcon={<Iconify icon="eva:sync-fill" />} // Changed icon
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? 'Syncing...' : 'Sync product'}
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />

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
                    <ProductTableToolbar
                        options={options}
                        filters={filters}
                        onResetPage={table.onResetPage}

                    />
                    {canReset && (
                        <ProductTableFiltersResult
                            filters={filters}
                            totalResults={dataFiltered.length}
                            onResetPage={table.onResetPage}
                            onClearGroup={onClearGroup} // Pass clear group callback
                            onClearSubGroup1={onClearSubGroup1} // Pass clear subGroup1 callback
                            onClearSubGroup2={onClearSubGroup2} // Pass clear subGroup2 callback

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
                                    headLabel={TABLE_PRODUCT_HEAD}
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
                                        <ProductTableRow
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
                title="Delete products?"
                content={
                    <Box>
                        <Typography gutterBottom>Are you sure you want to delete the selected products?</Typography>
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

