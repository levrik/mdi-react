import AccessPointIcon from './publish-react/AccessPointIcon';

// this will throw a type error
const noRender = () => (
  <>
    <AccessPointIcon>Things that are not shown</AccessPointIcon>
    <AccessPointIcon color={0} />
    <AccessPointIcon size />
    <AccessPointIcon className={5} />
  </>
);

// this should be the one to use
const render = () => (
  <>
    <AccessPointIcon></AccessPointIcon>
    <AccessPointIcon size={16} />
    <AccessPointIcon color="#fff" size="16" className="some-class" />
    <AccessPointIcon
      size={16} style={{display: 'block', margin: 'auto'}}
      onClick={() => {}} />
  </>
);
