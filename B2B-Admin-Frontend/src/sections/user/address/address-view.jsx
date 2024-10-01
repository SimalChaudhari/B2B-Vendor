import React from 'react';
import {
    Box,
    Typography,
    Divider,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Grid,
    Stack,
    Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
// View Page Dialog for displaying address details
export function AddressViewDialog({ open, onClose, addressView }) {
    if (!addressView) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    Address
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
                {/* User Address Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar
                        sx={{
                            bgcolor: 'primary.main',
                            width: { xs: 60, sm: 80 },
                            height: { xs: 60, sm: 80 },
                            mr: { xs: 2, sm: 3 },
                        }}
                    >
                        <HomeIcon sx={{ color: 'white' }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {addressView.street_address}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {addressView.city}, {addressView.state}, {addressView.country}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Additional Address Information Section */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocationOnIcon sx={{ mr: 1 }} />
                                Street Address:
                            </Typography>
                            <Typography  sx={{ mr: 1 }} variant="body1">{addressView.street_address || 'Not provided'}</Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocationCityIcon sx={{ mr: 1 }} />
                                City:
                            </Typography>
                            <Typography variant="body1">{addressView.city || 'Not provided'}</Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <HolidayVillageIcon sx={{ mr: 1 }} />
                                State:
                            </Typography>
                            <Typography variant="body1">{addressView.state || 'Not provided'}</Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <PublicIcon sx={{ mr: 1 }} />
                                Country:
                            </Typography>
                            <Typography variant="body1">{addressView.country || 'Not provided'}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
