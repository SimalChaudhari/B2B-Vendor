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

import { SUB_CATEGORY_STATUS_OPTIONS } from 'src/_mock'; // Ensure this is your mock data for user statuses
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { MenuItem, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch
import { editSubCategory } from 'src/store/action/subcategoryActions';
import { useFetchSubCategoryData } from '../components/fetch-sub-category';
import { categoryList } from 'src/store/action/categoryActions';

// ----------------------------------------------------------------------

export const SubCategoryEditSchema = zod.object({
    name: zod.string().min(1, { message: ' Name is required!' }),
    description: zod.string().min(1, { message: 'Description is required!' }),
    status: zod.string().min(1, { message: 'Status is required!' }),
    category: zod.string().min(1, { message: 'categoryId is required!' }),

});

// ----------------------------------------------------------------------

export function SubCategoryEditForm({ open, onClose, subcategoryData }) {
    const dispatch = useDispatch();
    const { fetchData } = useFetchSubCategoryData();

    const _categoryList = useSelector((state) => state.category?.category || []);

    useEffect(() => {
        const fetchCategoryData = async () => {
            await dispatch(categoryList());
        };
        fetchCategoryData();
    }, []);

    // Set the default values, including categoryId instead of category name
    const defaultValues = useMemo(
        () => ({
            name: subcategoryData?.name || '',
            description: subcategoryData?.description || '',
            status: subcategoryData?.status || SUB_CATEGORY_STATUS_OPTIONS[0].value,
            category: subcategoryData?.category?.id || '', // Use categoryId instead of name
        }),
        [subcategoryData]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(SubCategoryEditSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (subcategoryData) {
            reset(defaultValues);
        }
    }, [subcategoryData, reset, defaultValues]);

    const onSubmit = handleSubmit(async (data) => {
        // Construct the payload with categoryId
        const updatedData = {
            name: data.name,
            description: data.description,
            status: data.status,
            categoryId: data.category, // This is the categoryId, already selected from the form
        };

        // Dispatch the action with the updated data
        const isSuccess = await dispatch(editSubCategory(subcategoryData.id, updatedData));

        if (isSuccess) {
            reset();
            onClose();
            fetchData();
        }
    });

    return (
        <Dialog
            fullWidth
            maxWidth={false}
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { maxWidth: 720 } }}
        >
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>Edit Sub-Category</DialogTitle>

                <DialogContent>
                    <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
                        Please fill in the details below to edit the Sub Category.
                    </Alert>

                    <Box
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                    >
                        <Field.Text name="name" label="Name" />

                        <Field.Select name="category" label="Category">
                            {_categoryList.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
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
                    <Field.TextArea name="description" helperText="Description" sx={{ mt: 3 }} />
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

