import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import useUserRole from 'src/layouts/components/user-role';
import { Overview } from 'src/sections/overview/adminDash/view';

import { OverviewAppView } from 'src/sections/overview/app/view';
import { OverviewBookingView } from 'src/sections/overview/booking/view';

const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function OverviewAppPage() {

  const role = useUserRole()

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      {role === "Admin" ? <Overview/> :
        <OverviewBookingView />
      }

    </>
  );
}