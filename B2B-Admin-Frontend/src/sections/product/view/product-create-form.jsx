import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { MenuItem, Typography } from '@mui/material';
import { PRODUCT_STATUS_OPTIONS } from 'src/_mock'; // Ensure this is your mock data for user statuses
import { Form, Field, schemaHelper } from 'src/components/hook-form'; // Custom components for form handling
import { useDispatch, useSelector } from 'react-redux';
import { useFetchProductData } from '../components/fetch-product';
import { createProduct } from 'src/store/action/productActions';
import { subcategoryList } from 'src/store/action/subcategoryActions';

// ----------------------------------------------------------------------

// Validation schema for user creation using Zod
// Validation schema for product creation using Zod
export const ProductCreateSchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    description: zod.string().min(1, { message: 'Description is required!' }),
    price: zod.number().positive({ message: 'Price must be a positive number!' }),
    stock_quantity: zod.number().int().positive({ message: 'Stock Quantity must be a positive integer!' }),
    status: zod.string().min(1, { message: 'Status is required!' }),
    subcategoryId: zod.string().min(1, { message: 'Subcategory is required!' })
});


// ----------------------------------------------------------------------
// User Create Form Component
export function ProductCreateForm({ open, onClose }) {
    const dispatch = useDispatch();
    const { fetchData } = useFetchProductData(); // Destructure fetchData from the custom hook

    const _subCategoryList = useSelector((state) => state.subcategory?.subcategory || []);

    useEffect(() => {
        const fetchSubCategoryData = async () => {
            await dispatch(subcategoryList());
        };
        fetchSubCategoryData()
    }, []);


    // Default form values
    const defaultValues = useMemo(() => ({
        name: '',
        description: '',
        imageUrl: '',
        price: 0, // Initialize as 0 or some default number
        stock_quantity: 0, // Initialize as 0 or some default integer
        subcategoryId: '',
        status: PRODUCT_STATUS_OPTIONS[0]?.value,
    }), []);


    const methods = useForm({
        resolver: zodResolver(ProductCreateSchema),
        defaultValues,
    });
    //----------------------------------------------------------------------------------------------------
    const {
        reset,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = methods;

    // Handle form submission
    const onSubmit = async (data) => {
        const formattedData = {
            ...data
        };
        const response = await dispatch(createProduct(formattedData));
        if (response) {
            reset();
            onClose();
            fetchData()
        }
    };

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
            <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Add Product</DialogTitle>

                <DialogContent>
                    <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
                        Please fill in the details below to create a new product.
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
                        <Field.UploadAvatar name="imageUrl" maxSize={3145728} />
                        <Typography variant="caption" sx={{ mt: 3, mx: 'auto', textAlign: 'center', color: 'text.disabled' }}>
                            Allowed *.jpeg, *.jpg, *.png, *.gif
                        </Typography>
                    </Box>

                    <Box display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} gap={3}>
                        <Field.Text name="name" label="Name" />
                        <Field.Select name="subcategoryId" label="subcategory">
                            {_subCategoryList.map((sub) => (
                                <MenuItem key={sub.value} value={sub.id}>
                                    {sub.name}
                                </MenuItem>
                            ))}
                        </Field.Select>
                        <Field.Text name="description" label="Description" />
                        <Field.Text name="price" label="Price" type="number" />
                        <Field.Text name="stock_quantity" label="Stock Quantity" type="number" />
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
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>Create</LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    );
}
