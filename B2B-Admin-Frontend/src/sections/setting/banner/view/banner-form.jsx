import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { useRouter } from 'src/routes/hooks';
import { Box, Stack } from '@mui/material';

// Define schema for multiple file uploads
export const BannerFormSchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    bannerImage: zod
        .array(zod.any())
        .nonempty({ message: 'At least one banner image is required!' })
});

export function BannerForm({ currentBanner }) {
    const router = useRouter();

    const defaultValues = useMemo(
        () => ({
            name: currentBanner?.name || '',
            bannerImage: currentBanner?.bannerImage || [],
        }),
        [currentBanner]
    );

    const methods = useForm({
        resolver: zodResolver(BannerFormSchema),
        defaultValues,
    });

    const { reset, handleSubmit, setValue, watch, formState: { isSubmitting } } = methods;
    const values = watch();

    useEffect(() => {
        if (currentBanner) {
            reset(defaultValues);
        }
    }, [currentBanner, defaultValues, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
            reset();
            toast.success(currentBanner ? 'Update success!' : 'Create success!');
            router.push('/path/to/redirect'); // Adjust redirect path as needed
            console.info('DATA', data);
        } catch (error) {
            console.error(error);
        }
    });

    const handleRemoveFile = useCallback(
        (inputFile) => {
            const filtered = values.bannerImage.filter((file) => file !== inputFile);
            setValue('bannerImage', filtered);
        },
        [setValue, values.bannerImage]
    );

    const handleRemoveAllFiles = useCallback(() => {
        setValue('bannerImage', [], { shouldValidate: true });
    }, [setValue]);

    const renderBannerDetails = (
        <Card>
          <CardHeader title="Banner Details"  />
      
          <Divider sx={{mt:1}} />
      
          <Stack spacing={3} sx={{ p: 3 }}>
            <Field.Text name="name" label="Banner Name" />
      
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Banner Images</Typography>
              <Field.Upload
                name="bannerImage"
                multiple // Allow multiple file selection
                thumbnail
                maxSize={3145728}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>
      
            <Box display="flex" justifyContent="flex-end">
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                {currentBanner ? 'Save changes' : 'Create banner'}
              </LoadingButton>
            </Box>
          </Stack>
        </Card>
      );
      



    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Stack>
                {renderBannerDetails}

            </Stack>
        </Form>
    );
}
