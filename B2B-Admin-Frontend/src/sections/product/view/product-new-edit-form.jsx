import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
    Card, CardHeader, Divider, Stack, Box, Typography, InputAdornment, Switch,
    FormControlLabel, Grid
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Field, Form } from 'src/components/hook-form';

const PRODUCT_CATEGORY_GROUP_OPTIONS = [
    {
        group: 'Electronics',
        classify: ['Smartphones', 'Laptops', 'Tablets'],
    },
    {
        group: 'Fashion',
        classify: ['Shirts', 'Pants', 'Shoes'],
    },
    {
        group: 'Home & Kitchen',
        classify: ['Furniture', 'Appliances', 'Decor'],
    },
];
export const applicable = [
    { value: 'applicable', label: 'Applicable' },
    { value: 'not applicable', label: 'Not Applicable' },
];


const NewProductSchema = zod.object({
    alias: zod.string().optional(),
    alternateUnit: zod.string().optional(),
    baseUnit: zod.string().min(1, 'Base Unit is required!'),
    category: zod.string().min(1, 'Category is required!'),
    costPrice: zod.string().min(1, 'Cost Price is required!'),
    productImages: zod.any().refine((files) => files && files.length > 0, {
        message: 'Images are required!',
    }),
    costPriceDate: zod.string().min(1, 'Cost Price Date is required!'),
    description: zod.string().optional(),
    group: zod.string().optional(),
    gstApplicable: zod.string().min(1, 'GST Applicable is required!'),
    gstApplicableDate: zod.string().min(1, 'GST Applicable Date is required!'),
    gstRate: zod.string().optional(),
    hasExpiryDate: zod.string().min(1, 'Has Expiry Date is required!'),
    hasMfgDate: zod.string().min(1, 'Has Manufacturing Date is required!'),
    id: zod.string().optional(),
    isBatchWiseOn: zod.string().min(1, 'Is Batch Wise On is required!'),
    itemName: zod.string().min(1, 'Item Name is required!'),
    mrpDate: zod.string().min(1, 'MRP Date is required!'),
    mrpRate: zod.string().optional(),
    partNo: zod.string().optional(),
    remarks: zod.string().optional(),
    sellingPrice: zod.string().min(1, 'Selling Price is required!'),
    sellingPriceDate: zod.string().min(1, 'Selling Price Date is required!'),
});

export default function ProductNewEditForm({ currentProduct }) {
    const [includeTaxes, setIncludeTaxes] = useState(false);

    const defaultValues = useMemo(() => ({
        alias: currentProduct?.alias || '',
        alternateUnit: currentProduct?.alternateUnit || 'Not Applicable',
        baseUnit: currentProduct?.baseUnit || 'Nos',
        category: currentProduct?.category || '',
        costPrice: currentProduct?.costPrice || 0,
        costPriceDate: currentProduct?.costPriceDate || '',
        description: currentProduct?.description || '',
        group: currentProduct?.group || 'Primary',
        gstApplicable: currentProduct?.gstApplicable || 'Applicable',
        gstApplicableDate: currentProduct?.gstApplicableDate || '',
        gstRate: currentProduct?.gstRate || 0,
        hasExpiryDate: currentProduct?.hasExpiryDate || 'Yes',
        hasMfgDate: currentProduct?.hasMfgDate || 'No',
        id: currentProduct?.id || '',
        isBatchWiseOn: currentProduct?.isBatchWiseOn || 'Yes',
        itemName: currentProduct?.itemName || '',
        mrpDate: currentProduct?.mrpDate || '',
        mrpRate: currentProduct?.mrpRate || 0,
        partNo: currentProduct?.partNo || '',
        remarks: currentProduct?.remarks || '',
        sellingPrice: currentProduct?.sellingPrice || 0,
        productImages: currentProduct?.productImages || '',
        sellingPriceDate: currentProduct?.sellingPriceDate || '',
    }), [currentProduct]);

    const methods = useForm({
        resolver: zodResolver(NewProductSchema),
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

    const handleRemoveFile = useCallback((file) => {
        setValue('productImages', values.productImages.filter((img) => img !== file));
    }, [setValue, values.productImages]);

    const handleRemoveAllFiles = useCallback(() => {
        setValue('productImages', []);
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
                            onRemove={handleRemoveFile}
                            onRemoveAll={handleRemoveAllFiles}
                            onUpload={() => console.info('ON UPLOAD')}
                        />


                        <Field.Text name="itemName" label="Product Name" />
                        <Field.Text name="description" label="Description" multiline rows={5} />
                        <Field.Text name="remark" label="Remark" multiline rows={3} />


                    </Stack>
                </Card>

                <Card>
                    <CardHeader title="Product Properties" Fsx={{ py: 2 }} />
                    <Divider />
                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={2}>

                            <Grid item xs={12} sm={6}>
                                <Field.Text name="alias" label="Alias" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.Text name="partNo" label="Part No" />
                            </Grid>


                            <Grid item xs={12} sm={6}>
                                <Field.Select native name="category" label="Group" InputLabelProps={{ shrink: true }}>
                                    {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                                        <optgroup key={category.group} label={category.group}>
                                            {category.classify.map((classify) => (
                                                <option key={classify} value={classify}>
                                                    {classify}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </Field.Select>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Field.Select native name="category" label="Category" InputLabelProps={{ shrink: true }}>
                                    {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                                        <optgroup key={category.group} label={category.group}>
                                            {category.classify.map((classify) => (
                                                <option key={classify} value={classify}>
                                                    {classify}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </Field.Select>
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
                                    name="costPrice"
                                    label="Cost Price"
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.DatePicker
                                    name="costPriceDate"
                                    label="Cost Price Date"
                                    type="date"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.Text
                                    name="sellingPrice"
                                    label="Selling Price"
                                    type="number"
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
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.Select native name="gstApplicable" label="GST Applicable" InputLabelProps={{ shrink: true }}>
                                    {applicable.map((apply) => (
                                        <option key={apply.value}>
                                            {apply.label}
                                        </option>
                                    ))}
                                </Field.Select>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.DatePicker
                                    name="gstApplicableDate"
                                    label="GST Applicable Date"
                                    type="date"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>

                                <Field.Text
                                    name="mrpRate"
                                    label="mrp Rate"
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.DatePicker
                                    name="mrpDate"
                                    label="MRP Date"
                                    type="date"
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
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                }}
                            />
                        )}
                    </Stack>
                </Card>

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <LoadingButton type="submit" variant="contained" loading={false}>
                        Submit
                    </LoadingButton>
                </Stack>
            </Stack >
        </Form >
    );
}
