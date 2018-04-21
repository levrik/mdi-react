import AccessPointIcon from './publish-react/AccessPointIcon';
import { AccessPointNetworkIcon } from './publish-react';

// this will throw a type error
const noRender = () => (
  <>
    <AccessPointIcon>Things that are not shown</AccessPointIcon>
    <AccessPointIcon color={000} />
    <AccessPointIcon size />
    <AccessPointIcon className={5} />

    <AccessPointNetworkIcon>Things that are not shown</AccessPointNetworkIcon>
    <AccessPointNetworkIcon color={000} />
    <AccessPointNetworkIcon size />
    <AccessPointNetworkIcon className={5} />
  </>
);

// this should be the one to use
const render = () => (
  <>
    <AccessPointIcon></AccessPointIcon>
    <AccessPointIcon size={16} />
    <AccessPointIcon color="#fff" size="16" className="some-class" />

    <AccessPointNetworkIcon></AccessPointNetworkIcon>
    <AccessPointNetworkIcon size={16} />
    <AccessPointNetworkIcon color="#fff" size="16" className="some-class" />
  </>
);
