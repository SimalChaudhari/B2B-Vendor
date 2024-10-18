
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { ItemListView } from 'src/sections/vendor-sections/product/view';

const metadata = { title: `Products - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>
            <ItemListView />
        </>
    );
}
