import {useContext, createContext, useEffect} from 'react';
// import {useMount} from 'ahooks';
import {useAsync} from './hooks';
import API from '../api';

const bootstrapUser = async () => {
  const user = await API.fetchUserinfo();
  return user.data;
};

const AuthContext = createContext();
AuthContext.displayName = 'AuthContext';

export const AuthProvider = ({children}) => {
  const {
    data: user,
    // isLoading,
    // isIdle,
    // isError,
    run,
    setData: setUser,
  } = useAsync();

  const login = async (payload) =>
    await API.login(payload).then((res) => {
      if (res.data) {
        setUser(res.data);
      }
      return res;
    });

  const register = async (payload) =>
    await API.register(payload).then((res) => {
      if (res.data) {
        setUser(res.data);
      }
      return res;
    });

  const logout = async () => await API.logout().then(() => setUser(null));

  useEffect(() => {
    run(bootstrapUser());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{user, login, logout, register}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider中使用');
  }
  return context;
};
