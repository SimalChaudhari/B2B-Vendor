import React, { useEffect, useState } from 'react';
import {
    FormControl,
    Button,
    Box,
    Typography,
    Checkbox,
    Autocomplete,
    TextField
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchProductData } from 'src/sections/vendor-sections/product/components/fetch-product';
import { useSetState } from 'src/hooks/use-set-state';
import { ProductToolbar } from './products-toolbar';
import { applyFilterData } from '../filterApply/filter-data';
import { addToCart, cartList } from 'src/store/action/cartActions';

export function ProductFilterView() {
    const { fetchData } = useFetchProductData(); // Destructure fetchData from the custom hook
    const _productList = useSelector((state) => state.product?.product || []);
    const [tableData, setTableData] = useState(_productList);

    const options = _productList.map((opt) => ({
        group: opt.group,
        subGroup1: opt.subGroup1,
        subGroup2: opt.subGroup2,
        itemName: opt.itemName,
        quantity: opt.quantity,
    }));

    const filters = useSetState({
        itemName: '',
        group: '',
        subGroup1: '',
        subGroup2: '',
        status: 'all',
    });

    useEffect(() => {
        fetchData(); // Call fetchData when the component mounts
    }, []);

    const dataFiltered = applyFilterData({
        inputData: tableData,
        filters: filters.state,
    });

    useEffect(() => {
        setTableData(_productList);
    }, [_productList]);

    //-----------------------------------------------------------------------------------------------------------------------
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);

    const dispatch = useDispatch();

    const handleProductChange = (event, newValue) => {
        setSelectedProducts(newValue);
    };

    const fetchCartData = async () => {
        await dispatch(cartList());
    };;

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Build productsToAdd array from selectedProducts with default quantity 1
        const productsToAdd = selectedProducts.map((product) => ({
            productId: product.id,
            quantity: 100, // Default quantity is 1
        }));
        const data = { items: productsToAdd };
        try {
            await dispatch(addToCart(data)); // Dispatch the addToCart action
            fetchCartData()
            setSelectedProducts([]);

        } catch (error) {
            console.error('Submission failed', error);
        }
    };

    return (
        <div>
            <ProductToolbar options={options} filters={filters} />
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    mt: 3,
                    alignItems: 'center',
                }}
            >
                {/* Product Multi-Select Field with Checkbox */}
                <FormControl sx={{ flex: 1, minWidth: { xs: '100%', sm: '45%', md: '30%' } }}>
                    <Autocomplete
                        multiple
                        options={dataFiltered}
                        getOptionLabel={(option) => option.itemName}
                        value={selectedProducts}
                        onChange={handleProductChange}
                        disableCloseOnSelect // Keep the dropdown open after selecting an option
                        renderOption={(props, option, { selected }) => (
                            <li {...props}>
                                <Checkbox
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                {option.itemName}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Products"
                                placeholder="Choose products"
                                variant="outlined"
                            />
                        )}
                        isOptionEqualToValue={(option, value) =>
                            option.itemName === value.itemName
                        }
                        noOptionsText="No products found"
                    />

                </FormControl>

                {/* Quantity Display */}
                <Typography
                    variant="body1"
                    sx={{
                        ml: { xs: 0, sm: 5 },
                        minWidth: { xs: '100%', sm: '150px' },
                        textAlign: { xs: 'center', sm: 'left' },
                    }}
                >
                    Total Quantity: {totalQuantity}
                </Typography>

                {/* Apply Button */}
                <Button
                    sx={{
                        minWidth: { xs: '100%', sm: '300px' },
                        mt: { xs: 2, sm: 0 },
                    }}
                    size="large"
                    type="submit"
                    variant="contained"

                >
                    Apply
                </Button>
            </Box>
        </div>
    );
}
