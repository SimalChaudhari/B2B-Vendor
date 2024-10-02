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

import { USER_STATUS_OPTIONS } from 'src/_mock'; // Ensure this is your mock data for user statuses
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { editAddress } from 'src/store/action/addressActions';
import { useFetchAddressData } from '../components';
// import { useFetchAddressData } from '../../components';

// ----------------------------------------------------------------------

export const AddressEditSchema = zod.object({
    street_address: zod.string().min(1, { message: 'address Name is required!' }),
    city: zod.string().min(1, { message: 'City Name is required!' }),
    state: zod.string().min(1, { message: 'State Name is required!' }),
    zip_code: zod.string().min(1, { message: 'Zip code Name is required!' }),
    country: zod.string().min(1, { message: 'Country is required!' })
});

// ----------------------------------------------------------------------

export function AddressEditForm({ open, onClose, addressData }) {
    const dispatch = useDispatch(); // Initialize dispatch
    const { fetchData } = useFetchAddressData(); // Destructure fetchData from the custom hook

    const defaultValues = useMemo(
        () => ({
            street_address: addressData?.street_address || '',
            city: addressData?.city || '',
            state: addressData?.state || '',
            zip_code: addressData?.zip_code || '',
            country: addressData?.country || ''

        }),
        [addressData]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(AddressEditSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    // Reset form values when addressData changes
    useEffect(() => {
        if (addressData) {
            reset(defaultValues); // Reset form with updated default values
        }
    }, [addressData, reset, defaultValues]);


    const onSubmit = handleSubmit(async (data) => {
        const updatedData = {
            ...data
        };
        // Call the editUser action with user ID and updated data
        const isSuccess = await dispatch(editAddress(addressData.id, updatedData));
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
                <DialogTitle>Edit Address</DialogTitle>
                <DialogContent>
                    <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
                        Please fill in the details below to edit the Address.
                    </Alert>
                    <Box
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                    >
                        <Field.Text name="street_address" label="Address" />
                        <Field.Text name="city" label="City" />
                        <Field.Text name="state" label="State" />
                        <Field.Text name="zip_code" label="ZipCode" />
                        <Field.CountrySelect
                            fullWidth
                            name="country"
                            label="Country"
                            placeholder="Choose a country"
                        />

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
