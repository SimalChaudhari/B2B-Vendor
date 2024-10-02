import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { PRODUCT_STATUS_OPTIONS } from 'src/_mock'; // Ensure this is your mock data for user statuses
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { MenuItem, Typography } from '@mui/material';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { useFetchProductData } from '../components/fetch-product';
import { editProduct } from 'src/store/action/productActions';

// ----------------------------------------------------------------------

export const ProductEditSchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    description: zod.string().min(1, { message: 'Description is required!' }),
    price: zod.string().min(1, { message: 'Price is required!' }),
    imageUrl: zod.string().min(1, { message: 'ImageUrl is required!' }),
    stock_quantity: zod.string().min(1, { message: 'Stock Quantity is required!' }),
    status: zod.string().min(1, { message: 'Status is required!' })
});

// ----------------------------------------------------------------------

export function ProductEditForm({ open, onClose, productData }) {
    const dispatch = useDispatch(); // Initialize dispatch
    const { fetchData } = useFetchProductData(); // Destructure fetchData from the custom hook

    const defaultValues = useMemo(
        () => ({
            name: '',
            description: '',
            price: '',
            imageUrl: '',
            stock_quantity: '',
            status: productData?.status || PRODUCT_STATUS_OPTIONS[0]?.value, // Default to the first status option
        }),
        [productData]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(ProductEditSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    // Reset form values when userData changes
    useEffect(() => {
        if (productData) {
            reset(defaultValues); // Reset form with updated default values
        }
    }, [productData, reset, defaultValues]);


    const onSubmit = handleSubmit(async (data) => {
        const updatedData = {
            ...data,
            imageUrl: data.imageUrl || productData.imageUrl, // Use existing profile if not updated
        };
        // Call the editUser action with user ID and updated data
        const isSuccess = await dispatch(editProduct(productData.id, updatedData));
        if (isSuccess) {
            reset(); // Reset the form on successful update
            onClose(); // Close the dialog
            fetchData()
        }
    })

    return (
        <Dialog
            fullWidth
            maxWidth={false}
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { maxWidth: 720 } }}
        >
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>Edit Product</DialogTitle>

                <DialogContent>
                    <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
                        Please fill in the details below to edit the product.
                    </Alert>
                    <Box
                        sx={{
                            mb: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Field.UploadAvatar name="profile" maxSize={3145728} />
                        <Typography variant="caption" sx={{ mt: 3, mx: 'auto', textAlign: 'center', color: 'text.disabled' }}>
                            Allowed *.jpeg, *.jpg, *.png, *.gif
                        </Typography>
                    </Box>

                    <Box
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                    >
                        <Field.Text name="name" label="Name" />
                        <Field.Text name="description" label="Description" />
                        <Field.Text name="price" label="Price" />
                        <Field.Text name="stock_quantity" label="Stock Quantity" />
                        <Field.Select name="status" label="Status">
                            {PRODUCT_STATUS_OPTIONS.map((prod) => (
                                <MenuItem key={prod.value} value={prod.value}>
                                    {prod.label}
                                </MenuItem>
                            ))}
                        </Field.Select>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>

                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Update
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    );
}
