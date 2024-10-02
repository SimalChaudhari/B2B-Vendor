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
import { SUB_CATEGORY_STATUS_OPTIONS } from 'src/_mock'; // Ensure this is your mock data for user statuses
import { Form, Field, schemaHelper } from 'src/components/hook-form'; // Custom components for form handling
import { useDispatch, useSelector } from 'react-redux';
import { useFetchSubCategoryData } from '../components/fetch-sub-category';
import { createSubCategory } from 'src/store/action/subcategoryActions';
import { useFetchCategoryData } from 'src/sections/category/components';
import { categoryList } from 'src/store/action/categoryActions';

// ----------------------------------------------------------------------

// Validation schema for  Category creation using Zod
export const SubCategoryCreateSchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    description: zod.string().min(1, { message: 'Description is required!' }),
    categoryId: zod.string().min(1, { message: 'category is required!' }),
    status: zod.string().min(1, { message: 'Status is required!' })
});

// ----------------------------------------------------------------------
//  Category Create Form Component
export function SubCategoryCreateForm({ open, onClose }) {
    const dispatch = useDispatch();
    const { fetchData } = useFetchSubCategoryData(); // Destructure fetchData from the custom hook

    const _categoryList = useSelector((state) => state.category?.category || []);
  
    useEffect(() => {
        const fetchCategoryData = async () => {
            await dispatch(categoryList());
        };
        fetchCategoryData()
    }, []);

    // Default form values
    const defaultValues = useMemo(() => ({
        name: '',
        description: '',
        status: SUB_CATEGORY_STATUS_OPTIONS[0]?.value, // Default to the first status option
        categoryId: '',


    }), []);

    const methods = useForm({
        resolver: zodResolver(SubCategoryCreateSchema),
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
        const response = await dispatch(createSubCategory(formattedData));
        if (response) {
            reset();
            onClose();
            fetchData()
        }
    };

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
            <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Add Sub-Category</DialogTitle>

                <DialogContent>
                    <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
                        Please fill in the details below to create a new Sub-Category.
                    </Alert>
                    <Box display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} gap={3}>
                        <Field.Text name="name" label="name" />
                        <Field.Select name="categoryId" label="category">
                            {_categoryList.map((cat) => (
                                <MenuItem key={cat.value} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Field.Select>

                        <Field.Select name="status" label="Status">
                            {SUB_CATEGORY_STATUS_OPTIONS.map((status) => (
                                <MenuItem key={status.value} value={status.value}>
                                    {status.label}
                                </MenuItem>
                            ))}
                        </Field.Select>
                    </Box>
                    <Field.TextArea name="description" helperText="description" sx={{ mt: 3 }} />
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>Create</LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    );
}
