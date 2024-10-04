import { CategoryListView } from "src/sections/category/view";
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';

const metadata = { title: `Categories - ${CONFIG.site.name}` };
export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <CategoryListView />
        </>
    );
}
