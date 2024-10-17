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
import { editContact, editTerm } from 'src/store/action/settingActions';

const TermSchema = zod.object({
    content: zod.string().min(1, 'Term & Condition is required!'),
});



export default function TermEditForm({ currentTerm }) {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const defaultValues = useMemo(() => ({
        content: currentTerm?.content || '',
    }), [currentTerm]);

    const methods = useForm({
        resolver: zodResolver(TermSchema),
        defaultValues,
    });

    const { reset, handleSubmit, setValue, watch } = methods;
    const values = watch();

    useEffect(() => {
        if (currentTerm) {
            reset(defaultValues);
        }
    }, [currentTerm, defaultValues, reset]);

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            const response = await dispatch(editTerm(currentTerm.id, data));
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

                <Card>
                    <CardHeader title="Term & Conditions" sx={{ py: 2 }} />
                    <Divider />
                    <Stack spacing={2} sx={{ p: 3 }}>

                        <Typography variant="subtitle2">Term & Conditions</Typography>
                        <Field.Editor name="content" sx={{ maxHeight: 480 }} />
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
