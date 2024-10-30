import Grid from '@mui/material/Unstable_Grid2';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  TotalOrderIcon,
  CheckoutIllustration,
  SuccessOrderIcon,
  PendingOrderIcon,
} from 'src/assets/illustrations';
import { BookingStatistics } from '../booking-statistics';
import { BookingWidgetSummary } from '../booking-widget-summary';
import { useFetchOrderData } from 'src/sections/order/components/fetch-order';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { paths } from 'src/routes/paths';
import { useNavigate } from 'react-router';

// ----------------------------------------------------------------------

export function OverviewBookingView() {

  const widgetStyle = {
    cursor: 'pointer', // Add pointer cursor
  };
  const navigate = useNavigate(); // Initialize useNavigate

  const { fetchData } = useFetchOrderData();
  const _orders = useSelector((state) => state.order?.order || []);

  useEffect(() => {
    fetchData();
  }, []);

  // Get the current year dynamically
  const currentYear = new Date().getFullYear();

  // Generate months dynamically with the 'MMM-yyyy' format
  const allMonths = Array.from({ length: 12 }, (_, i) =>
    format(new Date(currentYear, i, 1), 'MMM-yyyy')
  );

  const monthlyData = _orders.monthlyData || [];
  const monthLookup = Object.fromEntries(
    monthlyData.map((item) => [format(new Date(item.month), 'MMM-yyyy'), item])
  );

  const totalOrders = allMonths.map((month) => monthLookup[month]?.total || 0);
  const completedOrders = allMonths.map((month) => monthLookup[month]?.completed || 0);
  const cancelledOrders = allMonths.map((month) => monthLookup[month]?.cancelled || 0);
  const pendingOrders = allMonths.map((month) => monthLookup[month]?.pending || 0);

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3} disableEqualOverflow>
        <Grid xs={12} md={3}>
          <BookingWidgetSummary
            title="Total Order"
            total={_orders?.statusSummary?.totalOrders}
            style={widgetStyle} // Apply style here
            onClick={() => navigate(paths.orders.root)} // Navigate to products route
            icon={<TotalOrderIcon />}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <BookingWidgetSummary
            title="Total Success"
            total={_orders?.statusSummary?.completed}
            style={widgetStyle} // Apply style here
            onClick={() => navigate(paths.orders.root)} // Navigate to products route
            icon={<SuccessOrderIcon />}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <BookingWidgetSummary
            title="Pending"
            total={_orders?.statusSummary?.pending}
            style={widgetStyle} // Apply style here
            onClick={() => navigate(paths.orders.root)} // Navigate to products route
            icon={<PendingOrderIcon />}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <BookingWidgetSummary
            title="Canceled"
            total={_orders?.statusSummary?.cancelled}
            style={widgetStyle} // Apply style here
            onClick={() => navigate(paths.orders.root)} // Navigate to products route
            icon={<CheckoutIllustration />}
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <BookingStatistics
            title="Monthly Orders Statistics"
            chart={{
              series: [
                { name: 'Total Orders', data: totalOrders },
                { name: 'Completed Orders', data: completedOrders },
                { name: 'Canceled Orders', data: cancelledOrders },
                { name: 'Pending Orders', data: pendingOrders },
              ],
              categories: allMonths,
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
