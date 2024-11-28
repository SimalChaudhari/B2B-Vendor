import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Container, Typography, TextField, Button } from '@mui/material';

import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { useCheckoutContext } from '../../context';
import { addAddress } from 'src/redux/orderProductAndAddressReducer';
import { Iconify } from 'src/components/iconify';

export const NewAddressSchema = zod.object({
    state: zod.string().min(1, { message: 'State is required!' }),
    name: zod.string().min(1, { message: 'Name is required!' }),
    address: zod.string().min(1, { message: 'Address is required!' }),
    pincode: zod.string().min(1, { message: 'Zip code is required!' }),
    mobile: schemaHelper.phoneNumber({ isValidPhoneNumber }),
    country: schemaHelper.objectOrNull({
        message: { required_error: 'Country is required!' },
    }),
    primary: zod.boolean(),
    email: zod.string().email({ message: 'Invalid email!' }).or(zod.literal('')),
});

export function FormView() {
    const addressData = useSelector((state) => state.order.address);

    const checkout = useCheckoutContext();
    const dispatch = useDispatch();

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(NewAddressSchema),
        defaultValues: {
            name: '',
            email: '',
            state: '',
            address: '',
            pincode: '',
            country: 'India',
            primary: true,
            mobile: '',
        },
    });

    const { handleSubmit, formState: { isSubmitting }, reset } = methods;

    // Update form values when addressData changes
    useEffect(() => {
        if (addressData) {
            reset(addressData);
        }
    }, [addressData, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const userDetails = {
                name: data.name,
                address: data.address,
                country: data.country,
                state: data.state,
                pincode: data.pincode,
                mobile: data.mobile,
                email: data.email,
            };

            dispatch(addAddress(userDetails));

            await checkout.onCreateBilling(data);
            checkout.onGotoStep(2);
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <div className='formContainer'>
            <Container sx={{ mb: 10 }}>
                <Form methods={methods} onSubmit={onSubmit}>
                    <Button
                        size="small"
                        color="inherit"
                        onClick={checkout.onBackStep}
                        startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                    >
                        Back
                    </Button>
                    <DialogContent dividers>
                        <Stack spacing={3}
                            sx={{ mt: 2 }}>
                            <Field.Text name="name" label="Name" />
                            <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                }}
                            >
                                <Field.Phone name="mobile" label="Phone number" />
                                <Field.Text name="email" label="Email" />
                            </Box>

                            <TextField
                                name="address"
                                label="Address"
                                multiline
                                rows={4}
                                fullWidth
                                {...methods.register('address')}
                                error={!!methods.formState.errors.address}
                            />

                            <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                }}
                            >
                                <Field.Text name="state" label="State" />
                                <Field.Text name="pincode" label="Pin/code" />
                            </Box>

                            <Field.CountrySelect name="country" label="Country" placeholder="Choose a country" />
                            <Field.Checkbox name="primary" label="Use this address as default." />
                        </Stack>
                    </DialogContent>

                    <DialogActions>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            Deliver to this address
                        </LoadingButton>
                    </DialogActions>
                </Form>
            </Container>
        </div>
    );
}
