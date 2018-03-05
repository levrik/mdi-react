import AccessPointIcon from './publish/AccessPointIcon';
import { AccessPointNetworkIcon } from './publish';

// this will throw a type error, as children are forbidden
const noRender = () => (
  <>
    <AccessPointIcon>Things that are not shown</AccessPointIcon>
    <AccessPointIcon color={000} />
    <AccessPointIcon size="23" />
  </>
);

const renderThatWorks = () => (
  <AccessPointNetworkIcon></AccessPointNetworkIcon>
);

// this should be the one to use
const render = () => (
  <AccessPointNetworkIcon color="#fff" size={16} />
);
