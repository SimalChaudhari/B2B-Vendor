import React, { useEffect, useState } from 'react';
import {
    TextField,
    Grid,
    Paper,
    Typography,
    Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchProductData } from 'src/sections/vendor-sections/product/components/fetch-product';
import { useSetState } from 'src/hooks/use-set-state';
import { ProductToolbar } from './products-toolbar';
import { applyFilterData } from '../filterApply/filter-data';


export function ProductFilterView() {

    const { fetchData } = useFetchProductData(); // Destructure fetchData from the custom hook
    const dispatch = useDispatch();

    const _productList = useSelector((state) => state.product?.product || []);
    const [tableData, setTableData] = useState(_productList);

    const options = _productList.map(opt => ({
        group: opt.group,
        subGroup1: opt.subGroup1,
        subGroup2: opt.subGroup2,

    }));

    const filters = useSetState({ itemName: '', group: '', subGroup1: '', subGroup2: '', status: 'all' });

    useEffect(() => {
        fetchData(); // Call fetchData when the component mounts
    }, []);

    const dataFiltered = applyFilterData({
        inputData: tableData,

        filters: filters.state,
    });
    console.log("🚀 ~ ProductFilterView ~ dataFiltered:", dataFiltered)

    useEffect(() => {
        setTableData(_productList);
    }, [_productList]);

    return (
        <div>
            <ProductToolbar options={options} filters={filters} />

            <div>
                {dataFiltered.map((row) => (
                    console.log(row.itemName)
                ))}
            </div>

        </div>

    );
}
