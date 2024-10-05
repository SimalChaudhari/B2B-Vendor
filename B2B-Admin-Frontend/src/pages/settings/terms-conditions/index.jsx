
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { TermsListView } from "src/sections/setting/terms-conditions/view";

const metadata = { title: `Terms Conditions - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <TermsListView />
        </>
    );
}
