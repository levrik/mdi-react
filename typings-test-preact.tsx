import AccessPointIcon from './publish-preact/AccessPointIcon';

// this will throw a type error
const noRender = () => (
  <>
    <AccessPointIcon>Things that are not shown</AccessPointIcon>
    <AccessPointIcon color={0} />
    <AccessPointIcon size />
    <AccessPointIcon class={{ 'some-class': true }} />
    <AccessPointIcon className={{ 'some-class': true }} />
  </>
);

// this should be the one to use
const render = () => (
  <>
    <AccessPointIcon></AccessPointIcon>
    <AccessPointIcon size={16} />
    <AccessPointIcon color="#fff" size="16" class="some-class" className="some-class" />
    <AccessPointIcon
      size={16} style={{display: 'block', margin: 'auto'}}
      onClick={() => {}} />
  </>
);
