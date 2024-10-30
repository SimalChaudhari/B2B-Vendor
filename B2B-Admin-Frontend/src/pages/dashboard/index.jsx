import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { OverviewBookingView } from 'src/sections/overview/booking/view';

const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewBookingView/>
    </>
  );
}