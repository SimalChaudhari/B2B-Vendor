import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
    Card, CardHeader, Divider, Stack, Box, Typography, InputAdornment, Switch,
    FormControlLabel, Grid
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Field, Form } from 'src/components/hook-form';

const imageURL = "https://t3.ftcdn.net/jpg/06/12/00/18/360_F_612001823_TkzT0xmIgagoDCyQ0yuJYEGu8j6VNVYT.jpg"

export default function ProductNewEditForm({ currentProduct }) {
    console.log("🚀 ~ ProductNewEditForm ~ currentProduct:", currentProduct.files[0].productImage)
    const [includeTaxes, setIncludeTaxes] = useState(false);

    const defaultValues = useMemo(() => ({
        id: currentProduct?.id || '',
        productImages: currentProduct?.files[0]?.productImage || '',
        itemName: currentProduct?.itemName || '',
        description: currentProduct?.description || '',
        alias: currentProduct?.alias || '',
        partNo: currentProduct?.partNo || '',
        group: currentProduct?.group || 'Primary',
        subGroup1: currentProduct?.subGroup1 || 'Primary',
        subGroup2: currentProduct?.subGroup2 || 'Primary',
        sellingPrice: currentProduct?.sellingPrice || 0,
        sellingPriceDate: currentProduct?.sellingPriceDate || '',
        gstApplicable: currentProduct?.gstApplicable || 'Applicable',
        gstApplicableDate: currentProduct?.gstApplicableDate || '',
        gstRate: currentProduct?.gstRate || 0,
        baseUnit: currentProduct?.baseUnit || 'Nos',
        alternateUnit: currentProduct?.alternateUnit || 'Not Applicable',
        taxability: currentProduct?.taxability || 'Not Applicable',
        conversion: currentProduct?.conversion || 'Not Applicable',
        denominator: currentProduct?.denominator || 'Not Applicable',
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

    const onSubmit = handleSubmit((data) => {
        console.log('Form Submitted', data);
    });

    const handleRemoveFile = useCallback((file, fieldName) => {
        setValue(fieldName, values[fieldName].filter((item) => item !== file));
    }, [setValue, values]);

    const handleRemoveAllFiles = useCallback((fieldName) => {
        setValue(fieldName, []);
    }, [setValue]);

    const handleIncludeTaxes = useCallback((event) => {
        setIncludeTaxes(event.target.checked);
    }, []);

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3}>

                <Card>
                    <CardHeader title="Product Details" sx={{ py: 2 }} />
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
                            onUpload={() => console.info('ON UPLOAD')}
                        />

                        <Field.Text name="itemName" label="Product Name" disabled />
                        <Field.Text name="description" label="Description" multiline rows={5} disabled />
                    </Stack>
                </Card>

                <Card>
                    <CardHeader title="Product Properties" sx={{ py: 2 }} />
                    <Divider />
                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Field.Text name="alias" label="Alias" disabled />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.Text name="partNo" label="Part No" disabled />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Field.Text name="group" label="Group" disabled />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Field.Text name="subGroup1" label="Sub-Group 1" disabled />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Field.Text name="subGroup2" label="Sub-Group 2" disabled />
                            </Grid>
                        </Grid>
                    </Box>
                </Card>

                <Card>
                    <CardHeader title="Pricing" />
                    <Divider />
                    <Stack spacing={2} sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Field.Text
                                    name="sellingPrice"
                                    label="Selling Price"
                                    type="number"
                                    disabled
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.DatePicker
                                    name="sellingPriceDate"
                                    label="Selling Price Date"
                                    type="date"
                                    disabled
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.Text name="gstApplicable" label="GST Applicable" disabled />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.DatePicker
                                    name="gstApplicableDate"
                                    label="GST Applicable Date"
                                    type="date"
                                    disabled
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <FormControlLabel
                            control={<Switch checked={includeTaxes} onChange={handleIncludeTaxes} />}
                            label="Include Taxes"
                        />
                        {!includeTaxes && (
                            <Field.Text
                                name="gstRate"
                                label="GST Rate (%)"
                                type="number"
                                disabled
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                }}
                            />
                        )}
                    </Stack>
                </Card>

                <Card>
                    <CardHeader title="Others" />
                    <Divider />
                    <Stack spacing={2} sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Field.Text name="baseUnit" label="BaseUnit" disabled />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.Text name="alternateUnit" label="AlternateUnit" disabled />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Field.Text name="conversion" label="Conversion" disabled />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.Text name="denominator" label="Denominator" disabled />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Field.Text name="taxability" label="Taxability" disabled />
                            </Grid>
                        </Grid>

                        <Typography variant="subtitle2">Dimensional Files</Typography>
                        <Field.AllUpload
                            multiple
                            thumbnail
                            name="dimensionalFiles"
                            maxSize={3145728}
                            onRemove={(file) => handleRemoveFile(file, 'dimensionalFiles')}
                            onRemoveAll={() => handleRemoveAllFiles('dimensionalFiles')}
                            onUpload={() => console.info('ON UPLOAD')}
                        />
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
