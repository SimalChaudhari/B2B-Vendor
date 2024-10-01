import { z as zod } from 'zod';
import React, { useMemo } from 'react';
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
import { USER_STATUS_OPTIONS } from 'src/_mock'; // Ensure this is your mock data for user statuses
import { Form, Field, schemaHelper } from 'src/components/hook-form'; // Custom components for form handling

import { useDispatch } from 'react-redux';
import { useFetchAddressData } from '../../components';
import { createAddress } from 'src/store/action/addressActions';

// ----------------------------------------------------------------------

// Validation schema for user creation using Zod
export const AddressCreateSchema = zod.object({
    street_address: zod.string().min(1, { message: 'address Name is required!' }),
    city: zod.string().min(1, { message: 'City Name is required!' }),
    state: zod.string().min(1, { message: 'State Name is required!' }),
    zip_code: zod.string().min(1, { message: 'Zip code Name is required!' }),
    country: zod.string().min(1, { message: 'Country is required!' })
});

// ----------------------------------------------------------------------
// User Create Form Component
export function AddressCreateForm({ open, onClose }) {
    const dispatch = useDispatch();
    const { fetchData } = useFetchAddressData(); // Destructure fetchData from the custom hook

    // Default form values
    const defaultValues = useMemo(() => ({
        street_address: '',
        city: '',
        state: '',
        zip_code: '',
        country: '', // Default to the first status option
    }), []);

    const methods = useForm({
        resolver: zodResolver(AddressCreateSchema),
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
        const response = await dispatch(createAddress(formattedData));
        if (response) {
            reset();
            onClose();
            fetchData()
        }
    };

    return (

        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
            <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Create New Address</DialogTitle>

                <DialogContent>
                    <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
                        Please fill in the details below to create a new Address.
                    </Alert>

                    <Box display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} gap={3}>
                        <Field.Text name="street_address" label="Address" />
                        <Field.Text name="city" label="City" />
                        <Field.Text name="state" label="State" />
                        <Field.Text name="country" label="Country" />
                        <Field.Text name="zip_code" label="ZipCode" />


                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>Create Address</LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>

    );
}
