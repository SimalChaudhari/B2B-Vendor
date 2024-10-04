import { ProductListView } from "src/sections/product/view";
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';

const metadata = { title: `Products - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <ProductListView />
        </>
    );
}
