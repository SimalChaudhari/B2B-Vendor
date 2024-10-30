import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { paths } from 'src/routes/paths';
import { useTabs } from 'src/hooks/use-tabs';
import { DashboardContent } from 'src/layouts/dashboard';
import { _userAbout, _userFeeds } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useMockedUser } from 'src/auth/hooks';
import { ProfileHome } from '../profile-home';
import { ProfileCover } from '../profile-cover';
import { useSelector } from 'react-redux';


// ----------------------------------------------------------------------

export function UserProfileView() {
  const { user } = useMockedUser();

  const [searchFriends, setSearchFriends] = useState('');

  const { authUser } = useSelector((state) => state.auth);

  const tabs = useTabs('profile');

  const handleSearchFriends = useCallback((event) => {
    setSearchFriends(event.target.value);
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.root },
          { name: user?.displayName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: 3, height: 290 }}>
        <ProfileCover
          role={authUser.role}
          name={authUser?.name}
          avatarUrl={user?.profile}
          coverUrl={_userAbout.coverUrl}
        />
      </Card>

      {tabs.value === 'profile' && <ProfileHome info={authUser}  />}

    </DashboardContent>
  );
}
