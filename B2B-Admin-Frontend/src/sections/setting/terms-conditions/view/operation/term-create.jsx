
import { paths } from 'src/routes/paths';
import { DashboardContent, PageContentLayout } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import TermCreateForm from '../form/term-create-form';

// Dummy product data
// ----------------------------------------------------------------------
export function TermCreateView() {

    return (
        <DashboardContent maxWidth='2xl'>
            <CustomBreadcrumbs
                heading="Create"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Term & Conditions', href: paths?.settings.terms_conditions },
                    { name: 'Create' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <PageContentLayout>
                <TermCreateForm/>
            </PageContentLayout>
        </DashboardContent>
    );
}
