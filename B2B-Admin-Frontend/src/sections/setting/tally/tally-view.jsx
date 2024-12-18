import { useState } from "react";
import { Box, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Grid } from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { paths } from "src/routes/paths";

export function TallyView() {
    const [ledgerData, setLedgerData] = useState([
        { id: 1, name: "Central Tax Ledger", value: "" },
        { id: 2, name: "State Tax Ledger", value: "" },
        { id: 3, name: "Interstate Tax Ledger", value: "" },
        { id: 4, name: "Discount Ledger", value: "" },
        { id: 6, name: "Sales Ledger", value: "" },
    ]);

    const [selectedLedger, setSelectedLedger] = useState(null); // Tracks the ledger being edited
    const [dialogOpen, setDialogOpen] = useState(false); // Dialog visibility state

    // Open the dialog with the selected ledger
    const handleEdit = (ledger) => {
        setSelectedLedger(ledger);
        setDialogOpen(true);
    };

    // Save the updated ledger value
    const handleSave = () => {
        if (selectedLedger) {
            const updatedData = ledgerData.map((ledger) =>
                ledger.id === selectedLedger.id ? { ...ledger, value: selectedLedger.value } : ledger
            );
            setLedgerData(updatedData);
        }
        setDialogOpen(false);
    };

    return (
        <DashboardContent maxWidth="2xl" sx={{ backgroundColor: "#f0f3f5", padding: "20px" }}>
            <CustomBreadcrumbs
                heading="Tally Settings"
                links={[
                    { name: "Dashboard", href: paths.dashboard.root },
                    { name: "Tally Settings", href: paths?.settings.tally },
                ]}
            />

            <Box sx={{ marginTop: 4 }}>
                <Grid container spacing={2}>
                    {ledgerData.map((ledger) => (
                        <Grid item xs={12} sm={6} key={ledger.id}>
                            <Card
                                sx={{
                                    backgroundColor: "#eaf4f1",
                                    border: "1px solid #007b5e",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                    cursor: "pointer",
                                }}
                                onClick={() => handleEdit(ledger)}
                            >
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: "bold",
                                            color: "#007b5e",
                                        }}
                                    >
                                        {ledger.name}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: "#333",
                                            marginTop: "10px",
                                        }}
                                    >
                                        {ledger.value || "Not Set"}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Dialog for Editing */}
            {selectedLedger && (
                <Dialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    fullWidth
                    maxWidth="sm"
                    sx={{
                        "& .MuiDialog-paper": {
                            backgroundColor: "#eaf4f1",
                            border: "2px solid #007b5e",
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            backgroundColor: "#007b5e",
                            color: "#fff",
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                    >
                        Edit {selectedLedger.name}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Ledger Value"
                            value={selectedLedger.value}
                            onChange={(e) =>
                                setSelectedLedger({ ...selectedLedger, value: e.target.value })
                            }
                            sx={{
                                marginTop: 2,
                                "& .MuiInputBase-root": {
                                    backgroundColor: "#fff",
                                },
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setDialogOpen(false)}
                            sx={{
                                color: "#007b5e",
                                fontWeight: "bold",
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            sx={{
                                backgroundColor: "#007b5e",
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "#005945",
                                },
                            }}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </DashboardContent>
    );
}
