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
    TableNoData,
    getComparator,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from 'src/components/table';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Typography } from '@mui/material';
import { applyFilter } from '../utils';
import { TABLE_CONTACT_HEAD } from 'src/components/constants';
import { useFetchContactData } from '../components/fetch-contact';
import { ContactTableToolbar } from './table/contact-table-toolbar';
import { ContactTableFiltersResult } from './table/contact-table-filter-result';
import { ContactTableRow } from './table/contact-table-row';

// ----------------------------------------------------------------------
export function ContactListView() {
    const table = useTable();
    const router = useRouter();
    const confirm = useBoolean();
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]); // Store selected row IDs


    const { fetchContactData, fetchDeleteContactData } = useFetchContactData(); // Destructure fetchData from the custom hook

    const dispatch = useDispatch();

    const _contactList = useSelector((state) => state.setting?.contact || []);
    console.log("🚀 ~ ContactListView ~ _contactList:", _contactList)

    const [tableData, setTableData] = useState(_contactList);

    // Update the initial state to include 
    const filters = useSetState({ searchTerm : '',question: '', answer: '', message: '' });
    //----------------------------------------------------------------------------------------------------
    useEffect(() => {
        fetchContactData(); // Call fetchData when the component mounts
    }, []);

    useEffect(() => {
        setTableData(_contactList);
    }, [_contactList]);
    //----------------------------------------------------------------------------------------------------

    const handleSelectRow = useCallback((id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    }, []);

    const handleDeleteSelectedRows = useCallback(() => {
        selectedRows.forEach((id) => fetchDeleteContactData(id));
        setSelectedRows([]);
        fetchContactData(); // Refresh data after deletion
        confirm.onFalse();
    }, [selectedRows, fetchDeleteContactData, fetchContactData]);

    //----------------------------------------------------------------------------------------------------

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: filters.state,
    });
    const canReset = !!filters.state.searchTerm;
    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    //----------------------------------------------------------------------------------------------------


    const handleDeleteRow = useCallback((id) => { fetchDeleteContactData(id) }, []);

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
                        { name: 'Contact', href: paths?.settings.contact_us },
                        { name: 'List' },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />} // Changed icon
                        >
                            <Link
                                component={RouterLink}
                                to="/settings/contact-us/create"
                                sx={{ textDecoration: 'none', color: 'inherit' }} // Ensure link inherits button style
                            >
                                Add Contact
                            </Link>
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />


                <Card>
                    <ContactTableToolbar filters={filters} onResetPage={table.onResetPage} />
                    {canReset && (
                        <ContactTableFiltersResult
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
                                    headLabel={TABLE_CONTACT_HEAD}
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
                                        <ContactTableRow
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
                        <Typography gutterBottom>Are you sure you want to delete the selected Contact?</Typography>
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

