import {useState, useEffect} from 'react';
import {useDebounce, useRequest} from 'ahooks';
import cl from 'classnames';
import AvatarBox from '../AvatarBox';
import API from '../../../../../../api';
import './index.less';

export default function UserSelector(props) {
  const {
    defaultValue = [],
    onChange = () => {},
  } = props;

  const [collaborators, setCollaborators] = useState(defaultValue);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, {wait: 500});

  const {data: users, run: searchUsers} = useRequest(async (kw) => {
    if (!kw) {
      return [];
    }
    const {data} = await API.searchUser({kw});
    for (const u of data) {
      const k = collaborators.find((s) => s._id === u._id);
      if (k) {
        u.disabled = true;
      }
    }
    return data;
  }, {manual: true});

  useEffect(() => {
    searchUsers(debouncedSearchValue);
  }, [debouncedSearchValue, searchUsers]);

  const onDeleteUser = (uid) => {
    const user = collaborators.filter((u) => u._id !== uid);
    setCollaborators(user);
    onChange(user);
  };

  const onAddUser = (user) => {
    if (user.disabled) {
      return;
    }
    onChange([...collaborators, user]);
    setCollaborators([...collaborators, user]);
  };

  const onInputBlur = (e) => {
    e.target.value = '';
    setSearchValue('');
  };


  return (
    <div className='component-user-selector'>
      <div className='avatarBox'>
        {
          collaborators.map((u) =>
            <AvatarBox
              key={u._id}
              _id={u._id}
              name={u.name}
              avatar={u.avatar}
              onDeleteUser={onDeleteUser}
            />,
          )
        }
      </div>
      <div className='search'>
        <input
          className='search-input'
          autoComplete="off"
          placeholder="通过名字搜索"
          onBlur={onInputBlur}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {
          searchValue &&
          <div className='search-panel'>
            {
              users &&
              users.map(
                  (user) =>
                    <p
                      className={cl({'disabled': user.disabled})}
                      key={user._id}
                      onMouseDown={() => onAddUser(user)}
                    >
                      {user.name}
                    </p>,
              )
            }
            {
              !users?.length && <span>用户不存在</span>
            }
          </div>
        }
      </div>
    </div>
  );
}
