import Grid from '@mui/material/Unstable_Grid2';
import { DashboardContent } from 'src/layouts/dashboard';
import { _bookings, _bookingNew, _bookingReview, _bookingsOverview } from 'src/_mock';
import {
  TotalOrderIcon,
  CheckoutIllustration,
  SuccessOrderIcon,
} from 'src/assets/illustrations';
import { BookingStatistics } from '../booking-statistics';
import { BookingWidgetSummary } from '../booking-widget-summary';

// ----------------------------------------------------------------------

export function OverviewBookingView() {
  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3} disableEqualOverflow>
        <Grid xs={12} md={4}>
          <BookingWidgetSummary
            title="Total Order"
            total={714000}
            icon={<TotalOrderIcon />}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <BookingWidgetSummary
            title="Total Success"
            total={311000}
            icon={<SuccessOrderIcon/>}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <BookingWidgetSummary
            title="Canceled"  
            total={124000}
            icon={<CheckoutIllustration />}
          />

        </Grid>
          <Grid xs={12} md={12} lg={12}>
            <BookingStatistics
              title="Statistics"
              chart={{
                series: [
                  {
                    name: 'Weekly',
                    categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                    data: [
                      { name: 'Sold', data: [24, 41, 35, 151, 49] },
                      { name: 'Canceled', data: [20, 56, 77, 88, 99] },
                    ],
                  },
                  {
                    name: 'Monthly',
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                    data: [
                      { name: 'Sold', data: [83, 112, 119, 88, 103, 112, 114, 108, 93] },
                      { name: 'Canceled', data: [46, 46, 43, 58, 40, 59, 54, 42, 51] },
                    ],
                  },
                  {
                    name: 'Yearly',
                    categories: ['2018', '2019', '2020', '2021', '2022', '2023'],
                    data: [
                      { name: 'Sold', data: [76, 42, 29, 41, 27, 96] },
                      { name: 'Canceled', data: [46, 44, 24, 43, 44, 43] },
                    ],
                  },
                ],
              }}
            />
          </Grid> 
        </Grid>
    </DashboardContent>
  );
}
