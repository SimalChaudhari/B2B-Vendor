import React from 'react';
import {
    Box,
    Typography,
    Avatar,
    Divider,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Grid,
    Stack,
} from '@mui/material';

// View Page Dialog for displaying user details
export function AddressViewDialog({ open, onClose, addressView }) {
    if (!addressView) return null;


    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    Address Details
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    X
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {/* User Profile Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, flexWrap: 'wrap' }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {addressView.street_address}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {addressView.city}
                        </Typography>

                        <Typography variant="body1" color="text.secondary">
                            {addressView.state}
                        </Typography> <Typography variant="body1" color="text.secondary">
                            {addressView.country}
                        </Typography>
                    </Box>
                </Box>

            </DialogContent>
        </Dialog>
    );
}
