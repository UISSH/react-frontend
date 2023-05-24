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
