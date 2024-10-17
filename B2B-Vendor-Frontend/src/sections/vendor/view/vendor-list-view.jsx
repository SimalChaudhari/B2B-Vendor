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
import { getVendorStatusOptions, TABLE_VENDOR_HEAD } from '../../../components/constants';

import { applyFilter } from '../utils';
import { useFetchVendorData } from '../components';
import { syncVendor } from 'src/store/action/vendorActions';
import { VendorTableToolbar } from './table/vendor-table-toolbar';
import { VendorTableFiltersResult } from './table/vendor-table-filters-result';
import { VendorTableRow } from './table/vendor-table-row';

// ----------------------------------------------------------------------
export function VendorListView() {
    const table = useTable();
    const router = useRouter();
    const confirm = useBoolean();
    const [loading, setLoading] = useState(false);

    const { fetchData ,fetchDeleteData} = useFetchVendorData(); // Destructure fetchData from the custom hook

    const dispatch = useDispatch();

    const _vendorList = useSelector((state) => state.vendor?.vendor || []);

    const [tableData, setTableData] = useState(_vendorList);

    const STATUS_OPTIONS = getVendorStatusOptions(tableData);

    // Update the initial state to include lastName, email, and mobile
    const filters = useSetState({ name: '', email: '', status: 'all' });
    //----------------------------------------------------------------------------------------------------
    useEffect(() => {
        fetchData(); // Call fetchData when the component mounts
    }, []);

    useEffect(() => {
        setTableData(_vendorList);
    }, [_vendorList]);
    //----------------------------------------------------------------------------------------------------

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: filters.state,
    });

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

    const handleSyncAPI = async () => {
        setLoading(true); // Set loading to true
        try {
            await dispatch(syncVendor());
            fetchData(); // Fetch data after syncing
        } catch (error) {
            console.error('Error syncing vendor:', error);
        } finally {
            setLoading(false); // Set loading to false after the API call completes
        }
    };

    //----------------------------------------------------------------------------------------------------

    return (
        <>
            <DashboardContent maxWidth="2xl">
                <CustomBreadcrumbs
                    heading="List"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'Vendor', href: paths?.dashboard?.vendor?.root },
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
                            {loading ? 'Syncing...' : 'Sync Vendor'}
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
                    <VendorTableToolbar filters={filters} onResetPage={table.onResetPage} />
                    {canReset && (
                        <VendorTableFiltersResult
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
                                    headLabel={TABLE_VENDOR_HEAD}
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
                                        <VendorTableRow
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
                title="Delete vendors?"
                content={
                    <Box>
                        <Typography gutterBottom>Are you sure you want to delete the selected vendors?</Typography>
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

