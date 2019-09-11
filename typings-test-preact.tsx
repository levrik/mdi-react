import AccessPointIcon from './publish-preact/AccessPointIcon';
import { AccessPointNetworkIcon } from './publish-preact';

// this will throw a type error
const noRender = () => (
  <>
    <AccessPointIcon>Things that are not shown</AccessPointIcon>
    <AccessPointIcon color={000} />
    <AccessPointIcon size />
    <AccessPointIcon class={{ 'some-class': true }} />
    <AccessPointIcon className={{ 'some-class': true }} />

    <AccessPointNetworkIcon>Things that are not shown</AccessPointNetworkIcon>
    <AccessPointNetworkIcon color={000} />
    <AccessPointNetworkIcon size />
    <AccessPointIcon class={{ 'some-class': true }} />
    <AccessPointNetworkIcon className={{ 'some-class': true }} />
  </>
);

// this should be the one to use
const render = () => (
  <>
    <AccessPointIcon></AccessPointIcon>
    <AccessPointIcon size={16} />
    <AccessPointIcon color="#fff" size="16" class="some-class" className="some-class" />

    <AccessPointNetworkIcon></AccessPointNetworkIcon>
    <AccessPointNetworkIcon size={16} />
    <AccessPointNetworkIcon color="#fff" size="16" class="some-class" className="some-class" />
    <AccessPointNetworkIcon
      size={16} style={{display: 'block', margin: 'auto'}}
      onClick={() => {}} />
  </>
);
