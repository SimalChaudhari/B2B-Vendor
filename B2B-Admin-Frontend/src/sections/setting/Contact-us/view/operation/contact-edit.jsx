
import { paths } from 'src/routes/paths';
import { DashboardContent, PageContentLayout } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { contactGetByList } from 'src/store/action/settingActions';
import ContactEditForm from '../form/contact-edit-form';

// Dummy product data
// ----------------------------------------------------------------------
export function ContactEditView() {
    const dispatch = useDispatch();
    const { id } = useParams(); // Get the product ID from URL
    const contact = useSelector((state) => state.setting.getByContact); // Access the product from the Redux store

    useEffect(() => {
        // Fetch the product data when the component mounts
        if (id) {
            dispatch(contactGetByList(id));
        }
    }, [id, dispatch]);

    return (
        <DashboardContent maxWidth='2xl'>
            <CustomBreadcrumbs
                heading="Edit"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Contact', href: paths?.settings.contact_us },
                    { name: 'Edit' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <PageContentLayout>
                <ContactEditForm currentContact={contact} />
            </PageContentLayout>
        </DashboardContent>
    );
}
