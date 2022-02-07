import { useContext } from 'react';
import { UserContext, } from '../utils/client/user-state';
import { logout } from '../utils/client/auth-actions';

export default function Home() {
    const userContext = useContext(UserContext);
    const user = userContext.userState.user
    window.location.href = "dashboard"
    const handleLogout = () => {
        logout();
    };

    return (
        <h1>
            Welcome <b>{user.username}</b>!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a onClick={handleLogout} style={{ cursor: 'pointer', color: 'red', textDecoration: 'underline' }}>
                log out :(
            </a>
        </h1>
    );
}
