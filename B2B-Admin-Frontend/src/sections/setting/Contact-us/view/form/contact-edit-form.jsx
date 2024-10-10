import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
    Card, CardHeader, Divider, Stack, Box, Typography, InputAdornment, Switch,
    FormControlLabel, Grid,
    MenuItem
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Field, Form } from 'src/components/hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { editContact } from 'src/store/action/settingActions';

const ContactSchema = zod.object({
    name: zod.string().min(1, 'Name is required!'),
    email: zod.string().min(1, 'Email is required!'),
    message: zod.string().min(1, 'Message is required!')
});


export default function ContactEditForm({ currentContact }) {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const defaultValues = useMemo(() => ({
        name: currentContact?.name || '',
        email: currentContact?.email || '',
        message: currentContact?.message || '',
    }), [currentContact]);

    const methods = useForm({
        resolver: zodResolver(ContactSchema),
        defaultValues,
    });

    const { reset, handleSubmit, setValue, watch } = methods;
    const values = watch();

    useEffect(() => {
        if (currentContact) {
            reset(defaultValues);
        }
    }, [currentContact, defaultValues, reset]);

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            const response = await dispatch(editContact(currentContact.id, data));
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

                <Card>
                    <CardHeader title="Contact Details" sx={{ py: 2 }} />
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

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <LoadingButton type="submit" variant="contained" loading={false}>
                        Submit
                    </LoadingButton>
                </Stack>
            </Stack>
        </Form>
    );
}
