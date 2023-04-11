const APPLICATION_OPTIONS: {
  [key: string]: {
    label: string;
    protocol: {
      value: string;
      readOnly: boolean;
    };
    port_or_range: {
      value: string;
      readOnly: boolean;
    };
  };
} = {
  custom: {
    label: "Custom",
    protocol: {
      value: "ALL",
      readOnly: false,
    },
    port_or_range: {
      value: "",
      readOnly: false,
    },
  },
  all_tcp: {
    label: "All TCP",
    protocol: {
      value: "TCP",
      readOnly: true,
    },
    port_or_range: {
      value: "0:65535",
      readOnly: true,
    },
  },
  all_udp: {
    label: "All UDP",
    protocol: {
      value: "UDP",
      readOnly: true,
    },
    port_or_range: {
      value: "1:65535",
      readOnly: true,
    },
  },
  all_protocols: {
    label: "All Protocols",
    protocol: {
      value: "ALL",
      readOnly: true,
    },
    port_or_range: {
      value: "1:65535",
      readOnly: true,
    },
  },
  ssh: {
    label: "SSH",
    protocol: {
      value: "TCP",
      readOnly: true,
    },
    port_or_range: {
      value: "22",
      readOnly: true,
    },
  },
  http: {
    label: "HTTP",
    protocol: {
      value: "TCP",
      readOnly: true,
    },
    port_or_range: {
      value: "80",
      readOnly: true,
    },
  },
  https: {
    label: "HTTPS",
    protocol: {
      value: "TCP",
      readOnly: true,
    },
    port_or_range: {
      value: "443",
      readOnly: true,
    },
  },
  ftp: {
    label: "FTP",
    protocol: {
      value: "TCP",
      readOnly: true,
    },
    port_or_range: {
      value: "21",
      readOnly: true,
    },
  },
  smtp: {
    label: "SMTP",
    protocol: {
      value: "TCP",
      readOnly: true,
    },
    port_or_range: {
      value: "25",
      readOnly: true,
    },
  },
  imap: {
    label: "IMAP",
    protocol: {
      value: "TCP",
      readOnly: true,
    },
    port_or_range: {
      value: "143",
      readOnly: true,
    },
  },
  pop3: {
    label: "POP3",
    protocol: {
      value: "TCP",
      readOnly: true,
    },
    port_or_range: {
      value: "110",
      readOnly: true,
    },
  },
  dns: {
    label: "DNS",
    protocol: {
      value: "UDP",
      readOnly: true,
    },
    port_or_range: {
      value: "53",
      readOnly: true,
    },
  },
  mysql: {
    label: "MySQL",
    protocol: {
      value: "TCP",
      readOnly: true,
    },
    port_or_range: {
      value: "3306",
      readOnly: true,
    },
  },
  postgresql: {
    label: "PostgreSQL",
    protocol: {
      value: "TCP",
      readOnly: true,
    },
    port_or_range: {
      value: "5432",
      readOnly: true,
    },
  },
  mongodb: {
    label: "MongoDB",
    protocol: {
      value: "TCP",
      readOnly: true,
    },
    port_or_range: {
      value: "27017",
      readOnly: true,
    },
  },
  redis: {
    label: "Redis",
    protocol: {
      value: "TCP",
      readOnly: true,
    },
    port_or_range: {
      value: "6379",
      readOnly: true,
    },
  },
  memcached: {
    label: "Memcached",
    protocol: {
      value: "TCP",
      readOnly: true,
    },
    port_or_range: {
      value: "11211",
      readOnly: true,
    },
  },
  rabbitmq: {
    label: "RabbitMQ",
    protocol: {
      value: "TCP",
      readOnly: true,
    },
    port_or_range: {
      value: "5672",
      readOnly: true,
    },
  },
  elasticsearch: {
    label: "Elasticsearch",
    protocol: {
      value: "TCP",
      readOnly: true,
    },
    port_or_range: {
      value: "9200",
      readOnly: true,
    },
  },
};

export default APPLICATION_OPTIONS;
