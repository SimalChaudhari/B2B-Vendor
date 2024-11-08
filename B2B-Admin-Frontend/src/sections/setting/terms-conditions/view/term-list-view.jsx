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
    TableNoData,
    getComparator,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from 'src/components/table';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Typography } from '@mui/material';
import { TABLE_TERM_HEAD } from 'src/components/constants';
import { useFetchTermData } from '../components/fetch-term';
import { TermTableToolbar } from './table/term-table-toolbar';
import { TermTableFiltersResult } from './table/term-table-filter-result';
import { TermTableRow } from './table/term-table-row';
import { applyFilter } from '../utils/filterUtils';


// ----------------------------------------------------------------------
export function TermsListView() {
    const table = useTable();
    const router = useRouter();
    const confirm = useBoolean();
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]); // Store selected row IDs


    const { fetchTermData, fetchDeleteTermData } = useFetchTermData(); // Destructure fetchData from the custom hook

    const dispatch = useDispatch();

    const _termList = useSelector((state) => state.setting?.termCondition || []);

    const [tableData, setTableData] = useState(_termList);

    // Update the initial state to include 
    const filters = useSetState({ searchTerm : '' ,content: '' });
    //----------------------------------------------------------------------------------------------------
    useEffect(() => {
        fetchTermData(); // Call fetchData when the component mounts
    }, []);

    useEffect(() => {
        setTableData(_termList);
    }, [_termList]);
    //----------------------------------------------------------------------------------------------------
    const handleSelectRow = useCallback((id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    }, []);

    const handleDeleteSelectedRows = useCallback(() => {
        selectedRows.forEach((id) => fetchDeleteTermData(id));
        setSelectedRows([]);
        fetchTermData(); // Refresh data after deletion
        confirm.onFalse();
    }, [selectedRows, fetchDeleteTermData, fetchTermData]);

    //----------------------------------------------------------------------------------------------------

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: filters.state,
    });
    const canReset = !!filters.state.searchTerm;
    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    //----------------------------------------------------------------------------------------------------

 
    const handleDeleteRow = useCallback((id) => { fetchDeleteTermData(id) }, []);

    const handleEditRow = useCallback((id) => id, []);

    const handleViewRow = useCallback((id) => id, []);
    //----------------------------------------------------------------------------------------------------

    return (
        <>
            <DashboardContent maxWidth="2xl">
                <CustomBreadcrumbs
                    heading="List"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'Term & Conditions', href: paths?.settings.terms_conditions },
                        { name: 'List' },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />} // Changed icon
                        >
                            <Link
                                component={RouterLink}
                                to="/settings/terms-conditions/create"
                                sx={{ textDecoration: 'none', color: 'inherit' }} // Ensure link inherits button style
                            >
                                Add
                            </Link>
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />


                <Card>
                    <TermTableToolbar filters={filters} onResetPage={table.onResetPage} />
                    {canReset && (
                        <TermTableFiltersResult
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
                        <Scrollbar>
                            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                                <TableHeadCustom
                                    order={table.order}
                                    orderBy={table.orderBy}
                                    headLabel={TABLE_TERM_HEAD}
                                    rowCount={dataFiltered.length}
                                    numSelected={selectedRows.length}
                                    onSort={table.onSort}
                                    onSelectAllRows={(checked) =>
                                      setSelectedRows(checked ? dataFiltered.map((row) => row.id) : [])
                                    }
                                />
                                <TableBody>
                                    {dataFiltered.slice(
                                        table.page * table.rowsPerPage,
                                        table.page * table.rowsPerPage + table.rowsPerPage
                                    ).map((row) => (
                                        <TermTableRow
                                            key={row.id}
                                            row={row}
                                            selected={selectedRows.includes(row.id)}
                                            onSelectRow={() => handleSelectRow(row.id)}
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
                title="Delete Contact?"
                content={
                    <Box>
                        <Typography gutterBottom>Are you sure you want to delete the selected Term & Conditions?</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            This action cannot be undone.
                        </Typography>
                    </Box>
                }
                action={
                    <Button onClick={handleDeleteSelectedRows} variant="contained" color="error">
                        Delete
                    </Button>
                }
            />
        </>
    );
}

