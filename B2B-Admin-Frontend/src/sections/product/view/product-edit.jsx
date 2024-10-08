
import { paths } from 'src/routes/paths';
import { DashboardContent, PageContentLayout } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import ProductNewEditForm from './product-new-edit-form';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { itemGetByList } from 'src/store/action/productActions';

// Dummy product data
// ----------------------------------------------------------------------
export function ProductEditView() {
    const dispatch = useDispatch();
    const { id } = useParams(); // Get the product ID from URL
    const product = useSelector((state) => state.product.getByProduct); // Access the product from the Redux store

    useEffect(() => {
        // Fetch the product data when the component mounts
        if (id) {
            dispatch(itemGetByList(id));
        }
    }, [id, dispatch]);

    return (
        <DashboardContent maxWidth='2xl'>
            <CustomBreadcrumbs
                heading="List"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Products', href: paths?.dashboard?.product?.root },
                    { name: 'List' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <PageContentLayout>
                <ProductNewEditForm currentProduct={product} />
            </PageContentLayout>
        </DashboardContent>
    );
}
