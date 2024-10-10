
import { paths } from 'src/routes/paths';
import { DashboardContent, PageContentLayout } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { termGetByList } from 'src/store/action/settingActions';
import TermEditForm from '../form/term-edit-form';


// Dummy product data
// ----------------------------------------------------------------------
export function TermEditView() {
    const dispatch = useDispatch();
    const { id } = useParams(); // Get the product ID from URL
    const term = useSelector((state) => state.setting.getByTermCondition); // Access the product from the Redux store

    useEffect(() => {
        // Fetch the product data when the component mounts
        if (id) {
            dispatch(termGetByList(id));
        }
    }, [id, dispatch]);

    return (
        <DashboardContent maxWidth='2xl'>
            <CustomBreadcrumbs
                heading="Edit"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Term', href: paths?.dashboard?.term?.root },
                    { name: 'Edit' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <PageContentLayout>
                <TermEditForm currentTerm={term} />
            </PageContentLayout>
        </DashboardContent>
    );
}
