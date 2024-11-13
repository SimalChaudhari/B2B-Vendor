import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { logout } from 'src/store/action/authActions';

const metadata = { title: `Logout - ${CONFIG.site.name}` };

export default function Page() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            const log = await dispatch(logout());
            if (log) {
                navigate('/auth/sign-in');
            }
        };
        handleLogout();
    }, [dispatch, navigate]);


    return (
        <Helmet>
            <title>{metadata.title}</title>
        </Helmet>
    );
}
