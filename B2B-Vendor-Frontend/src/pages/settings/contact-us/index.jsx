
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { ContactListView } from "src/sections/setting/Contact-us/view";

const metadata = { title: `Contact Us - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <ContactListView />
        </>
    );
}
