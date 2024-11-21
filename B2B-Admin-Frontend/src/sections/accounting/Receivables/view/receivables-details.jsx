
import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { Scrollbar } from 'src/components/scrollbar';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { useFetchData } from '../components/fetch-receivable';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
// ----------------------------------------------------------------------
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    [`& .${tableCellClasses.root}`]: {
        textAlign: 'right',
        borderBottom: 'none',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
}));

// ----------------------------------------------------------------------

export function ReceivablesListDetails({ invoice }) {

    const { fetchByIdData } = useFetchData()
    const { id } = useParams(); // Get the vendor ID from URL
    const receivable = useSelector((state) => state.accounting?.getByReceivable || []);
    console.log("🚀 ~ ReceivablesListDetails ~ receivable:", receivable)

    useEffect(() => {
        fetchByIdData(id)
    }, [])



    const renderFooter = (
        <Box gap={2} display="flex" alignItems="center" flexWrap="wrap" sx={{ py: 3 }}>
            <div>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    NOTES
                </Typography>
                <Typography variant="body2">
                    We appreciate your business. Should you need us to add VAT or extra notes let us know!
                </Typography>
            </div>

            <Box flexGrow={{ md: 1 }} sx={{ textAlign: { md: 'right' } }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Have a question?
                </Typography>
                <Typography variant="body2">info@alovate.io</Typography>
            </Box>
        </Box>
    );

    const renderList = (
        <Scrollbar sx={{ mt: 5 }}>
            <Table sx={{ minWidth: 960 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Tally Invoice No</TableCell>
                        <TableCell>Tally Order ID</TableCell>
                        <TableCell>NX Order ID</TableCell>
                        <TableCell align="center">Opening Balance</TableCell>
                        <TableCell align="center">Closing Balance</TableCell>
                        <TableCell align="center">Credit Period</TableCell>
                        <TableCell align="center">Bill Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {receivable?.bills?.length > 0 ? (
                        receivable?.bills.map((row, index) => (
                            <TableRow key={row.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row.tallyInvNo}</TableCell>
                                <TableCell>{row.tallyOrdId || '-'}</TableCell>
                                <TableCell>{row.nxOrderId || '-'}</TableCell>
                                <TableCell align="center">{row.openingBalance || '-'}</TableCell>
                                <TableCell align="center">{row.closingBalance || '-'}</TableCell>
                                <TableCell align="center">{row.creditPeriod || '-'}</TableCell>
                                <TableCell align="center">{fDate(row.billDate) || '-'}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} align="center">
                                <Typography variant="body2" color="text.secondary">
                                    No bills available.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Scrollbar>
    );

    return (

        <DashboardContent maxWidth="2xl">
            <CustomBreadcrumbs
                heading="List"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Receivable', href: paths?.dashboard?.accounting?.root },
                    { name: 'List' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Card sx={{ pt: 5, px: 5 }}>
                <Box
                    rowGap={3}
                    display="grid"
                    alignItems="center"
                    gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
                >

                    <Stack sx={{ typography: 'body2' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Customer Name
                        </Typography>
                        {receivable.customerName}
                    </Stack>

                    <Stack sx={{ typography: 'body2' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Credit Limit
                        </Typography>
                        {receivable.creditLimit}
                    </Stack>

                    <Stack sx={{ typography: 'body2' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Closing Balance
                        </Typography>
                        {receivable.closingBalance}
                    </Stack>
                </Box>
                <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

                {renderList}

                <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

                {renderFooter}
            </Card>
        </DashboardContent>
    );
}