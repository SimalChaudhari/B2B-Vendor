
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { GeneralListView } from 'src/sections/setting/General-settings/view';


const metadata = { title: `General - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <GeneralListView />
        </>
    );
}
