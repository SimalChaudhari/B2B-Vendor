import React from 'react'; // Add this import to avoid the 'React not defined' error
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector to access Redux state
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Container, Typography, Paper, Dialog, DialogTitle, DialogContentText, DialogActions as DialogActionsMUI, Grid, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';
import { addAddress, resetProductAndAddress } from 'src/redux/orderProductAndAddressReducer'; // Assuming you have a clearOrderData action
import { Image } from 'src/components/image';
import { useCheckoutContext } from '../../context';
import { generatePDF } from './generatePDF';
import { Iconify } from 'src/components/iconify';

export function OrderAndAddressView() {
    const checkout = useCheckoutContext();
    const dispatch = useDispatch();

    // Retrieve address and order details from the Redux store
    const address = useSelector((state) => state.order.address);
    const productDetails = useSelector((state) => state.order.productDetails);

    // State for controlling the confirmation dialog
    const [openDialog, setOpenDialog] = React.useState(false);

    // Handle the order confirmation
    const handleConfirmOrder = () => {
        setOpenDialog(true); // Open the confirmation dialog when the user clicks 'Confirm Order'
    };

    // Handle confirmation (Yes)
    const handleConfirmYes = async () => {
        generatePDF(address, checkout.items);
        try {
            // Wait for billing creation and go to step 3
            await checkout.onCreateBilling(address); // Assuming `address` is the necessary data for billing
            checkout.onGotoStep(3);

            // Clear the order data from Redux after successful order confirmation
            dispatch(resetProductAndAddress());

            // alert('Order confirmed!');
        } catch (error) {
            console.error('Order confirmation failed', error);
        } finally {
            setOpenDialog(false); // Close the confirmation dialog after the action
        }
    };

    // Handle cancel (No)
    const handleConfirmNo = () => {
        setOpenDialog(false); // Close the confirmation dialog when the user clicks 'No'
    };

    return (
        <div className='formContainer'>
            <Container maxWidth="lg" sx={{ mb: 10 }}>
                {/*
                <Typography variant="h4" sx={{ my: { xs: 3, md: 5 }, fontWeight: 'bold', color: '#333' }}>
                    Order Confirmation
                </Typography>
            */}
                <Button
                    size="small"
                    color="inherit"
                    onClick={checkout.onBackStep}
                    startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                >
                    Back
                </Button>

                {/* Address Section */}
                <Paper sx={{ p: 3, mb: 5, boxShadow: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Address Details:
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Name:</strong> {address ? address.name : 'N/A'}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Address:</strong> {address ? `${address.address}` : 'No Address provided.'}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>State:</strong> {address ? `${address.state}` : 'No State provided.'}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Country:</strong> {address ? ` ${address.country}` : 'No Country provided.'}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Pincode:</strong> {address ? `${address.pincode}` : 'No Pincode provided.'}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Phone:</strong> {address?.mobile || 'N/A'}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Email:</strong> {address?.email || 'N/A'}
                        </Typography>
                    </Box>
                </Paper>

                {/* Product Details Section */}
                <Paper sx={{ p: 3, mb: 5, boxShadow: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Product Details:
                    </Typography>
                    {/*
                        {productDetails ? (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Product Name:</strong> {productDetails.itemName}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Quantity:</strong> {productDetails.quantity}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Price:</strong> ₹{productDetails.sellingPrice}
                                </Typography>
                                {productDetails.productImages && productDetails.productImages.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" sx={{ mb: 1 }}><strong>Images:</strong></Typography>
                                        <Stack direction="row" spacing={2}>
                                            <Image src={productDetails.productImages[0]} alt="product-image" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
                                        </Stack>
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            <Typography variant="body1">No products in the order.</Typography>
                        )}
                    */}
                    <Grid container spacing={3}>
                        {checkout.items && checkout.items.length > 0 ? (
                            checkout.items.map((product, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            boxShadow: 5,
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            transition: 'transform 0.2s ease-in-out',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                            },
                                        }}
                                    >
                                        {product.productImages && product.productImages.length > 0 && (
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={product.productImages[0]}
                                                alt="product-image"
                                                sx={{
                                                    objectFit: 'contain',
                                                    p: 2,
                                                    backgroundColor: '#f4f4f4',
                                                }}
                                            />
                                        )}
                                        <CardContent>
                                            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                                {product.itemName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                <strong>Quantity:</strong> {product.quantity}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                <strong>Price:</strong> ₹{product.sellingPrice}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="body1" sx={{ textAlign: 'center', width: '100%' }}>
                                No products in the order.
                            </Typography>
                        )}
                    </Grid>
                </Paper>

                {/* Order Confirmation Button */}
                <DialogActions>
                    <LoadingButton
                        type="button"
                        variant="contained"
                        onClick={handleConfirmOrder}
                        sx={{
                            backgroundColor: '#00796b',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#004d40',
                            },
                            width: '100%',
                            padding: '14px',
                        }}
                    >
                        Confirm Order
                    </LoadingButton>
                </DialogActions>
            </Container>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleConfirmNo}>
                <DialogTitle>Confirm Order</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to confirm the order? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActionsMUI>
                    <LoadingButton onClick={handleConfirmNo} color="secondary">
                        No
                    </LoadingButton>
                    <LoadingButton onClick={handleConfirmYes} variant="contained" color="primary">
                        Yes
                    </LoadingButton>
                </DialogActionsMUI>
            </Dialog>
        </div>
    );
}
