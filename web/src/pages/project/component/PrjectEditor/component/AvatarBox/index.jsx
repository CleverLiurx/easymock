import ImgDelete from '../../../../../../assets/image/delete.svg';
import './index.less';

export default function AvatarBox(props) {
  const {
    _id,
    name,
    avatar,
    onDeleteUser = () => {},
  } = props;

  return (
    <div
      className='avatar-box'
      onClick={() => onDeleteUser(_id)}
    >
      <img src={avatar} alt={name} />
      <h4>{name}</h4>
      <h5>
        <img
          src={ImgDelete}
          alt='删除'
          width={18}
          height={18}
        />
      </h5>
    </div>
  );
}
