import { Container } from "@mui/material";
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
  state: string | JSX.Element;
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

export interface ContainerInspectIF {
  id: string;
  created: string;
  path: string;
  args: string[];
  state: State;
  image: string;
  resolvConfPath: string;
  hostnamePath: string;
  hostsPath: string;
  logPath: string;
  name: string;
  restartCount: number;
  driver: string;
  platform: string;
  mountLabel: string;
  processLabel: string;
  appArmorProfile: string;
  execIDs?: any;
  hostConfig: HostConfig;
  graphDriver: GraphDriver;
  mounts: Mount[];
  config: Config2;
  networkSettings: NetworkSettings;
}

interface NetworkSettings {
  bridge: string;
  sandboxID: string;
  hairpinMode: boolean;
  linkLocalIPv6Address: string;
  linkLocalIPv6PrefixLen: number;
  ports: { [key: string]: { hostIp: string; hostPort: string }[] };

  sandboxKey: string;
  secondaryIPAddresses?: any;
  secondaryIPv6Addresses?: any;
  endpointID: string;
  gateway: string;
  globalIPv6Address: string;
  globalIPv6PrefixLen: number;
  iPAddress: string;
  iPPrefixLen: number;
  iPv6Gateway: string;
  macAddress: string;
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

interface Config2 {
  hostname: string;
  domainname: string;
  user: string;
  attachStdin: boolean;
  attachStdout: boolean;
  attachStderr: boolean;
  exposedPorts: {};
  tty: boolean;
  openStdin: boolean;
  stdinOnce: boolean;
  env: string[];
  cmd: string[];
  healthcheck: Healthcheck;
  image: string;
  volumes: {};
  workingDir: string;
  entrypoint: string[];
  onBuild?: any;
  labels: {};
}

interface Healthcheck {
  test: string[];
  interval: number;
  timeout: number;
  startPeriod: number;
  retries: number;
}

interface Mount {
  type: string;
  name: string;
  source: string;
  destination: string;
  driver: string;
  mode: string;
  rW: boolean;
  propagation: string;
}

interface GraphDriver {
  data: Data;
  name: string;
}

interface Data {
  lowerDir: string;
  mergedDir: string;
  upperDir: string;
  workDir: string;
}

interface HostConfig {
  binds: any[];
  containerIDFile: string;
  logConfig: {};
  networkMode: string;
  portBindings: {};
  restartPolicy: RestartPolicy;
  autoRemove: boolean;
  volumeDriver: string;
  volumesFrom?: any;
  consoleSize: number[];
  capAdd?: any;
  capDrop?: any;
  cgroupnsMode: string;
  dns: any[];
  dnsOptions: any[];
  dnsSearch: any[];
  extraHosts?: any;
  groupAdd?: any;
  ipcMode: string;
  cgroup: string;
  links?: any;
  oomScoreAdj: number;
  pidMode: string;
  privileged: boolean;
  publishAllPorts: boolean;
  readonlyRootfs: boolean;
  securityOpt?: any;
  uTSMode: string;
  usernsMode: string;
  shmSize: number;
  runtime: string;
  isolation: string;
  cpuShares: number;
  memory: number;
  nanoCpus: number;
  cgroupParent: string;
  blkioWeight: number;
  blkioWeightDevice?: any;
  blkioDeviceReadBps?: any;
  blkioDeviceWriteBps?: any;
  blkioDeviceReadIOps?: any;
  blkioDeviceWriteIOps?: any;
  cpuPeriod: number;
  cpuQuota: number;
  cpuRealtimePeriod: number;
  cpuRealtimeRuntime: number;
  cpusetCpus: string;
  cpusetMems: string;
  devices?: any;
  deviceCgroupRules?: any;
  deviceRequests?: any;
  memoryReservation: number;
  memorySwap: number;
  memorySwappiness?: any;
  oomKillDisable?: any;
  pidsLimit?: any;
  ulimits?: any;
  cpuCount: number;
  cpuPercent: number;
  iOMaximumIOps: number;
  iOMaximumBandwidth: number;
  maskedPaths: string[];
  readonlyPaths: string[];
}

interface RestartPolicy {
  name: string;
  maximumRetryCount: number;
}

interface State {
  status: string;
  running: boolean;
  paused: boolean;
  restarting: boolean;
  oOMKilled: boolean;
  dead: boolean;
  pid: number;
  exitCode: number;
  error: string;
  startedAt: string;
  finishedAt: string;
  health: Health;
}

interface Health {
  status: string;
  failingStreak: number;
  log: Log[];
}

interface Log {
  start: string;
  end: string;
  exitCode: number;
  output: string;
}
