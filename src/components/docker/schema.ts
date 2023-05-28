export interface VolumeRowIF {
  nameJSX?: JSX.Element;
  name: string;
  driver: string;
  mount_point: string;
  type: string;
}

export interface ImageRowIF {
  id_name?: JSX.Element;
  id: string;
  created: string;
  size_bytes: string;
  tags: string;
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
  imageid: string;
  command: string;
  created: number | string;
  ports: Port[];
  labels: Labels;
  state: string;
  status: string;
  hostconfig: Hostconfig;
  networksettings: Networksettings;
  mounts: Mount[];
}

interface Mount {
  type: string;
  name: string;
  source: string;
  destination: string;
  driver: string;
  mode: string;
  rw: boolean;
  propagation: string;
}

interface Networksettings {
  networks: Networks;
}

interface Networks {
  bridge: Bridge;
}

interface Bridge {
  ipamconfig?: any;
  links?: any;
  aliases?: any;
  networkid: string;
  endpointid: string;
  gateway: string;
  ipaddress: string;
  ipprefixlen: number;
  ipv6gateway: string;
  globalipv6address: string;
  globalipv6prefixlen: number;
  macaddress: string;
  driveropts?: any;
}

interface Hostconfig {
  networkmode: string;
}

interface Labels {
  maintainer?: string;
}

interface Port {
  ip: string;
  privateport: number;
  publicport: number;
  type: string;
}
