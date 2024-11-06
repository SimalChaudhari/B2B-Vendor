import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { AppFeatured } from "./app-featured";
import { BannerForm } from "./banner-form";

const dummyData = [
    {
        id: 1,
        title: "App One",
        description: "An amazing app that does wonders.",
        coverUrl: "https://c8.alamy.com/comp/2FNCAXJ/online-shopping-banner-with-a-large-smartphone-with-presents-boxes-around-on-blue-background-2FNCAXJ.jpg"
    },
    {
        id: 2,
        title: "App Two",
        description: "A revolutionary app that changes everything.",
        coverUrl: "https://www.shutterstock.com/image-vector/happy-fathers-day-sale-banner-260nw-1721666293.jpg"
    },
    {
        id: 3,
        title: "App Three",
        description: "The ultimate app for all your needs.",
        coverUrl: "https://www.shutterstock.com/image-vector/online-shopping-web-banners-concepts-260nw-1713476485.jpg"
    }
];

export function BannerListView() {
    return (
        <DashboardContent maxWidth="2xl">
            <CustomBreadcrumbs
                heading="List"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Banner', href: paths?.settings.banner },
                    { name: 'List' },
                ]}

                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <BannerForm/>
            {/* <AppFeatured list={dummyData} /> */}
        </DashboardContent>


    )
}