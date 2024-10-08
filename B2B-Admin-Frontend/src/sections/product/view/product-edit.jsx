
import { paths } from 'src/routes/paths';
import { DashboardContent, PageContentLayout } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import ProductNewEditForm from './product-new-edit-form';

// Dummy product data
const product = {
    id: 1,
    name: 'Sample Product',
    price: 49.99,
    description: 'This is a top-rated sample product for demonstration purposes.',
    category: 'Electronics',
    stock: 20,
    rating: 4.5,
    reviews: [
        { user: 'John Doe', comment: 'Great product!', rating: 5 },
        { user: 'Jane Smith', comment: 'Good value for money.', rating: 4 },
    ],
    images: ['/path/to/image1.jpg', '/path/to/image2.jpg'],
};

// ----------------------------------------------------------------------
export function ProductEditView() {
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
