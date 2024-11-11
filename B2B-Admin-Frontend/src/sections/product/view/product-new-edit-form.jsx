import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
    Card, CardHeader, Divider, Stack, Box, Typography, InputAdornment, Switch,
    FormControlLabel, Grid
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Field, Form } from 'src/components/hook-form';
import { deleteProduct, editProduct } from 'src/store/action/productActions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

export default function ProductNewEditForm({ currentProduct }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false); // State to manage the loader

    const defaultValues = useMemo(() => ({
        id: currentProduct?.id || '',
        productImages: currentProduct?.productImages || '',
        dimensionalFiles: currentProduct?.dimensionalFiles || '',
    }), [currentProduct]);

    const methods = useForm({
        defaultValues,
    });

    const { reset, handleSubmit, setValue, watch } = methods;
    const values = watch();

    useEffect(() => {
        if (currentProduct) {
            reset(defaultValues);
        }
    }, [currentProduct, defaultValues, reset]);

    const onSubmit = handleSubmit(async (data) => {
        const formData = new FormData();
        const existingImages = values.productImages || [];
        existingImages.forEach((image) => {
            formData.append('productImages', image); // Append existing image URLs
        });
        const existingDimensionalFiles = values.dimensionalFiles || [];
        existingDimensionalFiles.forEach((file) => {
            formData.append('dimensionalFiles', file); // Append existing image URLs
        });

        try {
            setLoading(true); // Start loading
            const res = await dispatch(editProduct(currentProduct.id, formData));
            if (res) {
                navigate('/products')
            }
            setLoading(false); // Stop loading
        } catch (error) {
            console.error('Error updating product:', error);
            setLoading(false); // Stop loading
        }
    });

    const handleRemoveFile = useCallback(async (file, fieldName) => {
        try {
            const isLocalFile = file instanceof File;
            const imageField = fieldName === 'productImages' ? 'productImages' : 'dimensionalFiles';

            if (isLocalFile) {
                setValue(fieldName, values[fieldName].filter((item) => item !== file));
            } else {
                const result = await dispatch(deleteProduct(currentProduct.id, { [imageField]: [file] }));
                if (result) {
                    setValue(fieldName, values[fieldName].filter((item) => item !== file));
                }
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    }, [dispatch, currentProduct.id, setValue, values]);

    const handleRemoveAllFiles = useCallback(async (fieldName) => {
        try {
            const imageField = fieldName === 'productImages' ? 'productImages' : 'dimensionalFiles';
            const remoteFiles = values[fieldName].filter(file => !(file instanceof File)); // Remote files

            // Only dispatch deleteProduct if there are remote files
            if (remoteFiles.length > 0) {
                const result = await dispatch(deleteProduct(currentProduct.id, { [imageField]: remoteFiles }));
                if (result) {
                    setValue(fieldName, []); // Clear all files in state
                }
            } else {
                // If there are only local files, just clear the state
                setValue(fieldName, []);
            }
        } catch (error) {
            console.error('Error deleting all images:', error);
            // Optionally, you can show a notification or alert to the user
        }
    }, [dispatch, currentProduct.id, setValue, values]);

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3}>
                <Card>
                <CardHeader
                 title={`Item :  ${currentProduct?.itemName}`} sx={{ py: 2 }} />

                    <Divider />
                    <Stack spacing={2} sx={{ p: 3 }}>
                        <Typography variant="subtitle2">Product Images</Typography>
                        <Field.Upload
                            multiple
                            thumbnail
                            name="productImages"
                            maxSize={3145728}
                            onRemove={(file) => handleRemoveFile(file, 'productImages')}
                            onRemoveAll={() => handleRemoveAllFiles('productImages')}
                        />

                        <Typography variant="subtitle2">Dimensional Files</Typography>
                        <Field.SingleFile
                            multiple
                            thumbnail
                            name="dimensionalFiles"
                            maxSize={3145728}
                            onRemove={(file) => handleRemoveFile(file, 'dimensionalFiles')}
                            onRemoveAll={() => handleRemoveAllFiles('dimensionalFiles')}

                        // onUpload={() => console.info('ON UPLOAD')}
                        // onUpload={() => onSubmit()}
                        />
                    </Stack>
                </Card>

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <LoadingButton type="submit" variant="contained" loading={loading}>
                        Submit
                    </LoadingButton>
                </Stack>

            </Stack>
        </Form>
    );
}
