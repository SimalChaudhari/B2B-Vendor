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

import { CATEGORY_STATUS_OPTIONS } from 'src/_mock'; // Ensure this is your mock data for user statuses
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { MenuItem, Typography } from '@mui/material';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { useFetchCategoryData } from '../components';
import { editCategory } from 'src/store/action/categoryActions';

// ----------------------------------------------------------------------

export const CategoryEditSchema = zod.object({
    name: zod.string().min(1, { message: ' Name is required!' }),
    description: zod.string().min(1, { message: 'Description is required!' }),
    status: zod.string().min(1, { message: 'Status is required!' }),
});

// ----------------------------------------------------------------------

export function CategoryEditForm({ open, onClose, categoryData }) {
    const dispatch = useDispatch(); // Initialize dispatch
    const { fetchData } = useFetchCategoryData(); // Destructure fetchData from the custom hook

    const defaultValues = useMemo(
        () => ({
            name: categoryData?.name || '',
            description: categoryData?.description || '',
            status: categoryData?.status  // Default to the first status option
        }),
        [categoryData]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(CategoryEditSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    // Reset form values when userData changes
    useEffect(() => {
        if (categoryData) {
            reset(defaultValues); // Reset form with updated default values
        }
    }, [categoryData, reset, defaultValues]);


    const onSubmit = handleSubmit(async (data) => {
        const updatedData = {
            ...data
        };
        // Call the editUser action with user ID and updated data
        const isSuccess = await dispatch(editCategory(categoryData.id, updatedData));
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
                <DialogTitle>Edit User</DialogTitle>

                <DialogContent>
                    <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
                        Please fill in the details below to edit the Category.
                    </Alert>

                    <Box
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                    >
                        <Field.Text name="name" label="Name" />
                        <Field.Text name="description" label="Description" />
                        <Field.Select name="status" label="Status">
                            {CATEGORY_STATUS_OPTIONS.map((status) => (
                                <MenuItem key={status.value} value={status.value}>
                                    {status.label}
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
                        Update Category
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    );
}
