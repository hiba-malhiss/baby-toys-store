import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Flex } from '@baby-toys/ui-kit';
import { useAdminAuth } from '../../context/AuthContext';
import { useLoginDialogStore } from '../../store/useLoginDialogStore';
import LoginDialog from '../LoginDialog/LoginDialog';
import { useAdminLogout } from '../../api/authApi';
import s from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, hasPermission } = useAdminAuth();
  const { isOpen, open, close } = useLoginDialogStore();
  const { mutateAsync: logoutApi } = useAdminLogout();

  const logout = async () => {
    try {
      await logoutApi();
      navigate('/play');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/play');
    }
  };

  const isAdminMode = location.pathname.startsWith('/admin');
  const isAdmin = hasPermission();

  return (
    <header className={s.header}>
      {/* Main nav */}
      <div className={s.mainNav}>
        <Flex justify="between" align="center" fullWidth>
          {/* Logo */}
          <div className={s.logo} onClick={() => navigate('/play')}>
            <div className={s.logoIcon}>R</div>
            <div className={s.logoText}>
              <span className={s.logoLine1}>rainboow</span>
              <span className={s.logoLine2}>rattles</span>
            </div>
          </div>

          {/* Right actions */}
          <Flex align="center" spacing="m">
            {/* Role toggle — only visible to admin users */}
            {isAuthenticated && isAdmin && (
              <div className={s.modeToggle}>
                <button
                  className={`${s.modeBtn} ${!isAdminMode ? s.modeBtnActive : ''}`}
                  onClick={() => navigate('/play')}
                  title="Switch to Player view"
                >
                  🎮 Player
                </button>
                <button
                  className={`${s.modeBtn} ${isAdminMode ? s.modeBtnActive : ''}`}
                  onClick={() => navigate('/admin')}
                  title="Switch to Admin view"
                >
                  🛠️ Admin
                </button>
              </div>
            )}

            {isAuthenticated ? (
              <Button appearance="outline" color="primary" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Button appearance="solid" color="primary" onClick={open}>
                Admin Login
              </Button>
            )}
          </Flex>
        </Flex>
      </div>

      <LoginDialog open={isOpen} onClose={close} />
    </header>
  );
};

export default Header;
