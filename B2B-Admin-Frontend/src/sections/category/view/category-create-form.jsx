import { z as zod } from 'zod';
import { useMemo } from 'react';
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
import { CATEGORY_STATUS_OPTIONS } from 'src/_mock'; // Ensure this is your mock data for user statuses
import { Form, Field, schemaHelper } from 'src/components/hook-form'; // Custom components for form handling
import { useDispatch } from 'react-redux';
import { createCategory } from 'src/store/action/categoryActions';
import { useFetchCategoryData } from '../components';

// ----------------------------------------------------------------------

// Validation schema for  Category creation using Zod
export const CategoryCreateSchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    description: zod.string().min(1, { message: 'Description is required!' }),
    status: zod.string().min(1, { message: 'Status is required!' })
});

// ----------------------------------------------------------------------
//  Category Create Form Component
export function CategoryCreateForm({ open, onClose }) {
    const dispatch = useDispatch();
    const { fetchData } = useFetchCategoryData(); // Destructure fetchData from the custom hook

    // Default form values
    const defaultValues = useMemo(() => ({
        name: '',
        description: '',
        status: CATEGORY_STATUS_OPTIONS[0]?.value, // Default to the first status option

    }), []);

    const methods = useForm({
        resolver: zodResolver(CategoryCreateSchema),
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
        const response = await dispatch(createCategory(formattedData));
        if (response) {
            reset();
            onClose();
            fetchData()
        }
    };

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
            <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Add Category</DialogTitle>

                <DialogContent>
                    <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
                        Please fill in the details below to create a new Category.
                    </Alert>
                    <Box display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} gap={3}>
                        <Field.Text name="name" label="name" />
                        <Field.Select name="status" label="Status">
                            {CATEGORY_STATUS_OPTIONS.map((status) => (
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
