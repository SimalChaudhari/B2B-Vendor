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
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// View Page Dialog for displaying user details
export function SubCategoryViewDialog({ open, onClose, subcategoryView }) {
    if (!subcategoryView) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    Sub Category Details
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        Name:
                    </Typography>
                    <Typography variant="body1">{subcategoryView.name}</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        Description:
                    </Typography>
                    <Typography variant="body1">{subcategoryView.description}</Typography>
                </Box>

                {/* Status */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        Status:
                        {subcategoryView.status === 'Active' ? (
                            <CheckCircleIcon sx={{ color: 'green', ml: 1 }} />
                        ) : (
                            <CancelIcon sx={{ color: 'red', ml: 1 }} />
                        )}
                    </Typography>
                    <Typography variant="body1">{subcategoryView.status}</Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
