
import { paths } from 'src/routes/paths';
import { DashboardContent, PageContentLayout } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import ContactCreateForm from '../form/contact-create-form';

// Dummy product data
// ----------------------------------------------------------------------
export function ContactCreateView() {

    return (
        <DashboardContent maxWidth='2xl'>
            <CustomBreadcrumbs
                heading="Create"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Contact', href: paths?.settings.contact_us },
                    { name: 'Create' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <PageContentLayout>
                <ContactCreateForm/>
            </PageContentLayout>
        </DashboardContent>
    );
}
