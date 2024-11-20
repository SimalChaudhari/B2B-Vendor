import { useState } from "react";
import {
    Box,
    Typography,
    Switch,
    FormControlLabel,
    Paper,
    Grid,
    Divider,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { paths } from "src/routes/paths";

export function SyncView() {
    // States for each section
    const [productsAutoSync, setProductsAutoSync] = useState(false);
    const [productsManualSync, setProductsManualSync] = useState(false);

    const [ordersAutoSync, setOrdersAutoSync] = useState(false);
    const [ordersManualSync, setOrdersManualSync] = useState(false);

    const [vendorsAutoSync, setVendorsAutoSync] = useState(false);
    const [vendorsManualSync, setVendorsManualSync] = useState(false);

    const [ledgerAutoSync, setLedgerAutoSync] = useState(false);
    const [ledgerManualSync, setLedgerManualSync] = useState(false);

    const [receivablesAutoSync, setReceivablesAutoSync] = useState(false);
    const [receivablesManualSync, setReceivablesManualSync] = useState(false);

    // Confirmation Dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);

    const handleToggle = (setStateFunction, currentState) => {
        setDialogOpen(true);
        setCurrentAction(() => () => {
            setStateFunction(!currentState);
            setDialogOpen(false);
        });
    };

    const renderSyncCard = (
        title,
        autoSync,
        manualSync,
        setAutoSync,
        setManualSync
    ) => (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>{title}</Typography>
            <Divider />
            <Box sx={{ mt: 2 }}>
                <Typography>Auto Sync</Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={autoSync}
                            onChange={() => handleToggle(setAutoSync, autoSync)}
                            color="primary"
                        />
                    }
                    label={autoSync ? "Enabled" : "Disabled"}
                />
            </Box>
            <Box sx={{ mt: 2 }}>
                <Typography>Manual Sync</Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={manualSync}
                            onChange={() => handleToggle(setManualSync, manualSync)}
                            color="primary"
                        />
                    }
                    label={manualSync ? "Enabled" : "Disabled"}
                />
            </Box>

        </Paper>
    );

    return (
        <DashboardContent maxWidth="lg">
            <CustomBreadcrumbs
                heading="Sync Settings"
                links={[
                    { name: "Dashboard", href: paths.dashboard.root },
                    { name: "Sync Settings", href: paths?.settings.sync },
                ]}
            />
            <Box sx={{ p: 4 }}>
              
                <Grid container spacing={2}>
                    {/* Products */}
                    <Grid item xs={12} sm={6} md={4}>
                        {renderSyncCard(
                            "Products",
                            productsAutoSync,
                            productsManualSync,
                            setProductsAutoSync,
                            setProductsManualSync
                        )}
                    </Grid>
                    {/* Orders */}
                    <Grid item xs={12} sm={6} md={4}>
                        {renderSyncCard(
                            "Orders",
                            ordersAutoSync,
                            ordersManualSync,
                            setOrdersAutoSync,
                            setOrdersManualSync
                        )}
                    </Grid>
                    {/* Vendors */}
                    <Grid item xs={12} sm={6} md={4}>
                        {renderSyncCard(
                            "Vendors",
                            vendorsAutoSync,
                            vendorsManualSync,
                            setVendorsAutoSync,
                            setVendorsManualSync
                        )}
                    </Grid>
                    {/* Ledger Statement */}
                    <Grid item xs={12} sm={6} md={4}>
                        {renderSyncCard(
                            "Ledger Statement",
                            ledgerAutoSync,
                            ledgerManualSync,
                            setLedgerAutoSync,
                            setLedgerManualSync
                        )}
                    </Grid>
                    {/* Outstanding Receivables */}
                    <Grid item xs={12} sm={6} md={4}>
                        {renderSyncCard(
                            "Outstanding Receivables",
                            receivablesAutoSync,
                            receivablesManualSync,
                            setReceivablesAutoSync,
                            setReceivablesManualSync
                        )}
                    </Grid>
                </Grid>
            </Box>

            {/* Confirmation Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to change this sync setting?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={currentAction} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </DashboardContent>
    );
}
