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

const NewProductSchema = zod.object({
    name: zod.string().min(1, 'Name is required!'),
    description: zod.string().min(1, 'Description is required!'),
    images: zod.array(zod.string()).min(1, 'At least one image is required!'),
    code: zod.string().min(1, 'Product code is required!'),
    sku: zod.string().min(1, 'Product SKU is required!'),
    quantity: zod.number().min(1, 'Quantity is required!'),
    category: zod.string().min(1, 'Category is required!'),
    colors: zod.array(zod.string()).min(1, 'Choose at least one color!'),
    sizes: zod.array(zod.string()).min(1, 'Choose at least one size!'),
    price: zod.number().min(1, 'Price is required!'),
    priceSale: zod.number().optional(),
    tax: zod.number().optional(),
});

export default function ProductNewEditForm({ currentProduct }) {
    const [includeTaxes, setIncludeTaxes] = useState(false);

    const defaultValues = useMemo(() => ({
        name: currentProduct?.name || '',
        description: currentProduct?.description || '',
        code: currentProduct?.code || '',
        sku: currentProduct?.sku || '',
        quantity: currentProduct?.quantity || 0,
        category: currentProduct?.category || '',
        colors: currentProduct?.colors || [],
        sizes: currentProduct?.sizes || [],
        images: currentProduct?.images || [],
        price: currentProduct?.price || 0,
        priceSale: currentProduct?.priceSale || '',
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
        setValue('images', values.images.filter((img) => img !== file));
    }, [setValue, values.images]);

    const handleRemoveAllFiles = useCallback(() => {
        setValue('images', []);
    }, [setValue]);

    const handleIncludeTaxes = useCallback((event) => {
        setIncludeTaxes(event.target.checked);
    }, []);

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3}>

                <Card>
                    <CardHeader title="Product Details" subheader="Enter basic product information" />
                    <Divider />
                    <Stack spacing={2} sx={{ p: 3 }}>
                        <Field.Text name="name" label="Product Name" />
                        <Field.Text name="description" label="Description" multiline rows={4} />
                        <Typography variant="subtitle2">Images</Typography>
                        <Field.Upload
                            name="images"
                            multiple
                            thumbnail
                            maxSize={3145728}
                            onRemove={handleRemoveFile}
                            onRemoveAll={handleRemoveAllFiles}
                        />
                    </Stack>
                </Card>

                <Card>
                    <CardHeader title="Product Properties" subheader="Enter product attributes" />
                    <Divider />
                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Field.Text name="code" label="Product Code" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.Text name="sku" label="Product SKU" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.Text name="quantity" label="Quantity" type="number" />
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
                    <CardHeader title="Pricing" subheader="Enter price details" />
                    <Divider />
                    <Stack spacing={2} sx={{ p: 3 }}>
                        <Field.Text
                            name="price"
                            label="Regular Price"
                            type="number"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                        <Field.Text
                            name="priceSale"
                            label="Sale Price"
                            type="number"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                        <FormControlLabel
                            control={<Switch checked={includeTaxes} onChange={handleIncludeTaxes} />}
                            label="Include Taxes"
                        />
                        {!includeTaxes && (
                            <Field.Text
                                name="tax"
                                label="Tax (%)"
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
            </Stack>
        </Form>
    );
}
