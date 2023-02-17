import {useState} from 'react';
import {useAuth} from '../../../../lib/content';
import Dialog from '../../../Dialog';
import LoginForm from '../../../LoginForm';
import SignupForm from '../../../SingupForm';
import ImgUser from '../../../../assets/image/user.svg';
import ImgLogout from '../../../../assets/image/logout.svg';
import ImgHelp from '../../../../assets/image/help.svg';
import tips from '../../../../lib/tips';
import './index.less';

export default function UserCenter() {
  const [loginDialog, setLoginDialog] = useState(false);
  const [signupDialog, setSignupDialog] = useState(false);

  const {user, login, logout, register} = useAuth();

  const handleLogin = (params) => {
    login(params).then((res) => {
      if (res.code === 1) {
        setLoginDialog(false);
      } else {
        tips({
          msg: res.errorMsg,
        });
      }
    });
  };

  const handleRegister = (params) => {
    register(params).then((res) => {
      if (res.code === 1) {
        setSignupDialog(false);
      } else {
        tips({
          msg: res.errorMsg,
        });
      }
    });
  };

  const handleLogout = () => {
    logout().then(() => {
      window.location.reload();
    });
  };

  const UserAvatar = () => {
    return (
      <div className='avatar-container'>
        <div
          className='avatar-image'
          style={{'backgroundImage': `url(${user.avatar})`}}
        />
        <ul>
          <li>Hi, {user.name}</li>
          <li>
            <img
              src={ImgUser}
              width={16}
              height={16}
              alt="修改信息"
            />
            <span>修改信息</span>
          </li>
          <li onClick={() => handleLogout()}>
            <img
              src={ImgLogout}
              width={16}
              height={16}
              alt="退出"
            />
            <span>退出</span>
          </li>
        </ul>
      </div>
    );
  };

  const LoginPanel = () => {
    return <div>
      <span className='login' onClick={() => {
        setLoginDialog(true);
      }}>登录</span>
      <span className='signup' onClick={() => {
        setSignupDialog(true);
      }}>注册</span>
    </div>;
  };

  return (
    <div className='user-panel'>
      <div className='content'>
        <a href="/help" target="__blank">
          <img src={ImgHelp} alt="帮助" />
        </a>
        {
          user?._id ? <UserAvatar />: <LoginPanel />
        }
      </div>
      <Dialog open={loginDialog} width='325px'>
        <LoginForm
          onClose={() => setLoginDialog(false)}
          onSubmit={handleLogin}
        />
      </Dialog>
      <Dialog open={signupDialog} width='325px'>
        <SignupForm
          onClose={() => setSignupDialog(false)}
          onSubmit={handleRegister}
        />
      </Dialog>
    </div>
  );
}
