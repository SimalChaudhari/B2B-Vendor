import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { MenuItem } from '@mui/material';
import { CATEGORY_STATUS_OPTIONS } from 'src/_mock'; // Mock data for category statuses
import { Form, Field } from 'src/components/hook-form'; // Custom components for form handling
import { useDispatch } from 'react-redux'; 
import { createCategory, editCategory } from 'src/store/action/categoryActions';
import { useFetchCategoryData } from '../components';

// Validation schema using Zod
export const CategorySchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    description: zod.string().optional(), // Make description optional
    status: zod.string().min(1, { message: 'Status is required!' }),
});

// ----------------------------------------------------------------------
// Unified Category Form Component (for both Create and Edit)
export function CategoryForm({ open, onClose, categoryData }) {
    const dispatch = useDispatch();
    const { fetchData } = useFetchCategoryData(); // Custom hook to fetch category data

    // Default form values (adjusted based on whether editing or creating)
    const defaultValues = useMemo(() => ({
        name: categoryData?.name || '',
        description: categoryData?.description || '', // Optional
        status: categoryData?.status || CATEGORY_STATUS_OPTIONS[0]?.value, // Default to the first status option if creating
    }), [categoryData]);

    const methods = useForm({
        resolver: zodResolver(CategorySchema),
        defaultValues,
    });

    const { reset, handleSubmit, formState: { isSubmitting } } = methods;

    // Reset form when categoryData changes (for edit mode)
    useEffect(() => {
        if (categoryData) {
            reset(defaultValues);
        }
    }, [categoryData, reset, defaultValues]);

    // Handle form submission (create or update)
    const onSubmit = handleSubmit(async (data) => {
        const formattedData = { ...data };

        if (categoryData) {
            // Edit mode
            const isSuccess = await dispatch(editCategory(categoryData.id, formattedData));
            if (isSuccess) {
                reset();
                onClose();
                fetchData(); // Refresh data after update
            }
        } else {
            // Create mode
            const response = await dispatch(createCategory(formattedData));
            if (response) {
                reset();
                onClose();
                fetchData(); // Refresh data after creation
            }
        }
    });

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>{categoryData ? 'Edit Category' : 'Add Category'}</DialogTitle>

                <DialogContent>
                    <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
                        {categoryData ? 'Please update the category details.' : 'Please fill in the details to create a new category.'}
                    </Alert>
                    <Box display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} gap={3}>
                        <Field.Text name="name" label="Name" />
                        <Field.Select name="status" label="Status">
                            {CATEGORY_STATUS_OPTIONS.map((status) => (
                                <MenuItem key={status.value} value={status.value}>
                                    {status.label}
                                </MenuItem>
                            ))}
                        </Field.Select>
                    </Box>
                    <Field.TextArea name="description" helperText="Description (Optional)" sx={{ mt: 3 }} />
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        {categoryData ? 'Update' : 'Create'}
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    );
}
