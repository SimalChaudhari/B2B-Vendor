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
export function ProductViewDialog({ open, onClose, productView }) {
    if (!productView) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    Product Details
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
                {/* Product Profile Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, flexWrap: 'wrap' }}>
                    <Avatar
                        alt={productView.name}
                        src={productView.imageUrl || '/path-to-placeholder-image'}
                        sx={{ width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 }, mr: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 0 } }}
                    />
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {`${productView.name}}`}
                        </Typography>

                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* User Information Section */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Product Information
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <PhoneIcon sx={{ mr: 1 }} />
                                Stock Quantity:
                            </Typography>
                            <Typography variant="body1">{productView.stock_quantity || 'Not provided'}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />

                {/* Status */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        Status:
                        {productView.status === 'Active' ? (
                            <CheckCircleIcon sx={{ color: 'green', ml: 1 }} />
                        ) : (
                            <CancelIcon sx={{ color: 'red', ml: 1 }} />
                        )}
                    </Typography>
                    <Typography variant="body1">{productView.status}</Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
