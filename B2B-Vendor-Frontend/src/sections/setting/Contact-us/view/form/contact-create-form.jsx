import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
    Card, CardHeader, Divider, Stack, MenuItem,
    Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Field, Form } from 'src/components/hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { createContact } from 'src/store/action/settingActions';

// Zod schema for validation
const ContactSchema = zod.object({
    name: zod.string().min(1, 'Name is required!'),
    email: zod.string().min(1, 'Email is required!'),
    message: zod.string().min(1, 'Message is required!')
});

export default function ContactCreateForm() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // State for loading button
    const [loading, setLoading] = useState(false);

    // Initialize form with useForm hook
    const methods = useForm({
        resolver: zodResolver(ContactSchema),
        defaultValues: {
            name: '',
            email: '',
            message: '',
        },
    });

    const { handleSubmit, watch } = methods;
    const values = watch();



    // Submit handler
    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            const response = await dispatch(createContact(data));
            if (response) {
                navigate('/settings/contact-us')
            }
        } catch (error) {
            console.error('Submission failed', error);
        } finally {
            setLoading(false);
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3}>
                {/* FAQ Details Card */}
                <Card>
                    <CardHeader title="Create Contact" sx={{ py: 2 }} />
                    <Divider />
                    <Stack spacing={2} sx={{ p: 3 }}>
                        {/* Question Field */}
                        <Typography variant="subtiQuestiontle2">Name</Typography>
                        <Field.Text name="name" label="Name" />
                        {/* Answer Field */}
                        <Typography variant="subtitle2">Email</Typography>
                        <Field.Text name="email" label="Email" />
                        {/* Status Select Field */}
                        <Typography variant="subtitle2">Message</Typography>
                        <Field.Editor name="message" sx={{ maxHeight: 480 }} />
                    </Stack>
                </Card>

                {/* Submit Button */}
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <LoadingButton type="submit" variant="contained" loading={loading}>
                        Add Contact
                    </LoadingButton>
                </Stack>
            </Stack>
        </Form>
    );
}
