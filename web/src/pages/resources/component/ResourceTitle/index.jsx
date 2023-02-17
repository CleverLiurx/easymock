import './index.less';

export default function ResourceTitle({
  name,
  projectId,
  apiPrefix,
  onClickCreate = () => {},
}) {
  return (
    <div className='component-resource-title'>
      <div className='component-resource-title-endpoint'>
        <div className='label'>{name}</div>
        <div className='url'>
          {`http://${projectId}.easymock.bayuechuqi.com`}
          <span>{apiPrefix}</span>
            /:endpoint
        </div>
      </div>
      <div className='component-resource-title-handle'>
        <button onClick={() => onClickCreate()}>新建资源</button>
      </div>
    </div>
  );
}
