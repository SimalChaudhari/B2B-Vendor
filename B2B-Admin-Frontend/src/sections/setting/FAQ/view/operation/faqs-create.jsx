
import { paths } from 'src/routes/paths';
import { DashboardContent, PageContentLayout } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import FAQCreateForm from '../form/faqs-new-create-form';

// Dummy product data
// ----------------------------------------------------------------------
export function FAQCreateView() {

    return (
        <DashboardContent maxWidth='2xl'>
            <CustomBreadcrumbs
                heading="List"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'FAQs', href: paths?.dashboard?.faq?.root },
                    { name: 'List' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <PageContentLayout>
                <FAQCreateForm />
            </PageContentLayout>
        </DashboardContent>
    );
}
