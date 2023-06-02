export interface VolumeRowIF {
  nameJSX?: JSX.Element;
  name: string;
  driver: string;
  mountpoint: string;
}

export interface ImageRowIF {
  tags: JSX.Element;
  size: string;
  id_name?: JSX.Element;
  id: string;
  created: string;
  repoTags: string[];
}
export interface ContainerRowIF {
  id_name?: JSX.Element;
  port?: JSX.Element;
  cgroup_namespace: string;
  command: string;
  config_entrypoint: string;
  created: string;
  env_variables: string;
  finished_at: string;
  id: string;
  image: string;
  image_id: string;
  ipc_namespace: string;
  mnt_namespace: string;
  name: string;
  net_namespace: string;
  path: string;
  pid: string;
  pid_namespace: string;
  privileged: string;
  readonly_rootfs: string;
  security_options: string;
  started_at: string;
  state: string;
  status: string;
  user_namespace: string;
  uts_namespace: string;
}

export interface ContainersIF {
  containers: ContainerIF[];
}

export interface ContainerIF {
  port?: string | JSX.Element;
  name?: string | JSX.Element;
  id_name?: JSX.Element;
  id: string;
  names: string[];
  image: string;
  imageID: string;
  command: string;
  created: number | string;
  ports: Port[];
  labels: Labels;
  state: string;
  status: string;
  hostConfig: HostConfig;
  networkSettings: NetworkSettings;
  mounts: any[];
}

interface NetworkSettings {
  networks: Networks;
}

interface Networks {
  bridge: Bridge;
}

interface Bridge {
  iPAMConfig?: any;
  links?: any;
  aliases?: any;
  networkID: string;
  endpointID: string;
  gateway: string;
  iPAddress: string;
  iPPrefixLen: number;
  iPv6Gateway: string;
  globalIPv6Address: string;
  globalIPv6PrefixLen: number;
  macAddress: string;
  driverOpts?: any;
}

interface HostConfig {
  networkMode: string;
}

interface Labels {
  maintainer: string;
}

interface Port {
  iP: string;
  privatePort: number;
  publicPort: number;
  type: string;
}
