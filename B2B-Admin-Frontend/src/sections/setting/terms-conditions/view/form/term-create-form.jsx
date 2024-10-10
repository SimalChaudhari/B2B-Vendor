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
import {  createTerm } from 'src/store/action/settingActions';

// Zod schema for validation
const TermSchema = zod.object({
    content: zod.string().min(1, 'Term & Condition is required!'),
});

export default function TermCreateForm() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // State for loading button
    const [loading, setLoading] = useState(false);

    // Initialize form with useForm hook
    const methods = useForm({
        resolver: zodResolver(TermSchema),
        defaultValues: {
            content: '',
        },
    });

    const { handleSubmit, watch } = methods;
    const values = watch();



    // Submit handler
    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            const response = await dispatch(createTerm(data));
            if (response) {
                navigate('/settings/terms-conditions')
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
                    <CardHeader title="Create Term & Condition" sx={{ py: 2 }} />
                    <Divider />
                    <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2">Term & Condition</Typography>
                        <Field.Editor name="content" sx={{ maxHeight: 480 }} />
                    </Stack>
                </Card>

                {/* Submit Button */}
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <LoadingButton type="submit" variant="contained" loading={loading}>
                        Add
                    </LoadingButton>
                </Stack>
            </Stack>
        </Form>
    );
}
