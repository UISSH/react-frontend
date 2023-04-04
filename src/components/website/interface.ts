import { MutableRefObject } from "react";

export interface ApplicationType {
  info: Info;
  attr: AttrElement[];
}

export interface AttrElement {
  attr: AttrAttr;
  name: string;
  label: Description;
  value: null | string;
  required: boolean;
  description: Description;
}

export interface AttrAttr {}

export interface Description {
  default: string;
  [name: string]: string;
}

export interface Info {
  name: string;
  author: string;
  website_url: string;
  docs_url: string;
  download_url: string;
  name_version: string;
  code_version: number;
  agreement_name: string;
  description: string;
  agreement_url: null;
}

export interface CreateDatabase {
  name: string;
  username: string;
  password: string;
  website?: number;
}
export interface CreateWebsiteBody {
  name: string;
  domain: string;
  ssl_enable: boolean;
  index_root: string;
  application: string;
  application_config: { [key: string]: any };
}

export interface WebsiteResponse {
  id: number;
  ssl_config: Sslconfig;
  database_id?: any;
  database_name?: any;
  web_server_type_text: "Nginx" | "Apache" | string;
  status_text: string;
  create_at: string;
  update_at: string;
  name: string;
  domain: string;
  extra_domain?: any;
  ssl_enable: boolean;
  index_root: string;
  status: number;
  status_info: string;
  web_server_type: number;
  application: string;
  application_config: { [key: string]: any };
  valid_web_server_config: string;
  user: number;
}

export interface DatabaseRespose {
  id: number;
  own_username: string;
  create_status_text: string;
  database_type_text: string;
  create_at: string;
  update_at: string;
  name: string;
  username: string;
  password: string;
  database_type: number;
  character: string;
  collation: string;
  authorized_ip: string;
  create_status: number;
  user: number;
  website: number;
}

export interface BaseSettingChangeData {
  name: string;
  domain: string;
  ssl_enable: boolean;
  index_root: string;
  database?: {
    name: string;
    username: string;
    password: string;
  };
}
export interface CreateWebsiteStepProps {
  requestBody: MutableRefObject<RequestBodyIF>;
  onPreviousStep?: () => void;
  onNextStep?: () => void;
}
interface Sslconfig {
  certbot: Certbot;
  path: Path;
  method: string;
}

interface Path {
  certificate: string;
  key: string;
}

interface Certbot {
  email: string;
  provider: string;
}

export interface RequestBodyIF {
  website: WebsiteIF;
  database: DatabaseIF;
}

interface DatabaseIF {
  name?: string;
  username?: string;
  password?: string;
}

interface WebsiteIF {
  application?: string;
  name?: string;
  domain?: string;
  ssl_enable?: boolean;
  index_root?: string;
  application_config?: Record<string, string>;
}
