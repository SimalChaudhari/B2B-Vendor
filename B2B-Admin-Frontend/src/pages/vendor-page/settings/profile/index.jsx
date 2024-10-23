
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { UserProfileView } from 'src/sections/vendor-sections/setting/profile/view';

const metadata = { title: `profile - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>
            <UserProfileView/>
        </>
    );
}
