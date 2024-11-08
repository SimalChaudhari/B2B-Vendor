import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
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

import { BannerTableToolbar } from './table/banner-table-toolbar';
import { BannerTableFiltersResult } from './table/banner-table-filter-result';
import { BannerTableRow } from './table/banner-table-row';
import { useFetchBannerData } from '../components/fetch-banner';
import { TABLE_BANNER_HEAD } from 'src/components/constants';

// ----------------------------------------------------------------------

export function BannerListView() {
    const table = useTable();
    const router = useRouter();
    const confirm = useBoolean();
    const [loading, setLoading] = useState(false);

    const { fetchBannerData, fetchDeleteBannerData } = useFetchBannerData();

    const dispatch = useDispatch();

    const bannerList = useSelector((state) => state.setting?.banner || []);
  
    const [tableData, setTableData] = useState(bannerList);

    // Initialize filters state
    const filters = useSetState({ searchTerm: '' });

    useEffect(() => {
        fetchBannerData(); // Fetch banners when the component mounts
    }, []);

    useEffect(() => {
        setTableData(bannerList);
    }, [bannerList]);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: filters.state,
    });
    const canReset = !!filters.state.searchTerm;
    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    const handleDeleteRows = useCallback((id) => { fetchDeleteBannerData(id) }, []);

    const handleDeleteRow = useCallback((id) => { fetchDeleteBannerData(id) }, []);

    const handleEditRow = useCallback((id) => id, []);

    const handleViewRow = useCallback((id) => id, []);

    return (
        <>
            <DashboardContent maxWidth="2xl">
                <CustomBreadcrumbs
                    heading="Banner List"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'Banner', href: paths?.dashboard?.banner?.root },
                        { name: 'List' },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            <Link
                                component={RouterLink}
                                to="/settings/banner/create"
                                sx={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                Add Banner
                            </Link>
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />

                <Card>
                    <BannerTableToolbar filters={filters} onResetPage={table.onResetPage} />
                    {canReset && (
                        <BannerTableFiltersResult
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
                                    headLabel={TABLE_BANNER_HEAD}
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
                                        <BannerTableRow
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
                title="Delete Banner?"
                content={
                    <Box>
                        <Typography gutterBottom>Are you sure you want to delete the selected banner?</Typography>
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
