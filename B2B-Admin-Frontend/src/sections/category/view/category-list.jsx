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
export function CategoryViewDialog({ open, onClose, categoryView }) {
    if (!categoryView) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                Category Details
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
                {/* User Profile Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, flexWrap: 'wrap' }}>
                    <Avatar
                        alt={categoryView.name}
                        src={categoryView.profileUrl || '/path-to-placeholder-image'}
                        sx={{ width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 }, mr: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 0 } }}
                    />
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {`${categoryView.description}`}
                        </Typography>
                      
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />



                <Divider sx={{ my: 3 }} />

                {/* Status */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        Status:
                        {categoryView.status === 'Active' ? (
                            <CheckCircleIcon sx={{ color: 'green', ml: 1 }} />
                        ) : (
                            <CancelIcon sx={{ color: 'red', ml: 1 }} />
                        )}
                    </Typography>
                    <Typography variant="body1">{categoryView.status}</Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
