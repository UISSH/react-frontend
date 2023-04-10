const APPLICATION_OPTIONS: {
  [key: string]: {
    label: string;
    protocol: {
      value: string;
      onlyread: boolean;
    };
    port_or_range: {
      value: string;
      onlyread: boolean;
    };
  };
} = {
  custom: {
    label: "Custom",
    protocol: {
      value: "ALL",
      onlyread: false,
    },
    port_or_range: {
      value: "",
      onlyread: false,
    },
  },
  all_tcp: {
    label: "All TCP",
    protocol: {
      value: "TCP",
      onlyread: true,
    },
    port_or_range: {
      value: "0-65535",
      onlyread: true,
    },
  },
  all_udp: {
    label: "All UDP",
    protocol: {
      value: "UDP",
      onlyread: true,
    },
    port_or_range: {
      value: "0-65535",
      onlyread: true,
    },
  },
  all_protocols: {
    label: "All Protocols",
    protocol: {
      value: "ALL",
      onlyread: true,
    },
    port_or_range: {
      value: "0-65535",
      onlyread: true,
    },
  },
  ssh: {
    label: "SSH",
    protocol: {
      value: "TCP",
      onlyread: true,
    },
    port_or_range: {
      value: "22",
      onlyread: true,
    },
  },
  http: {
    label: "HTTP",
    protocol: {
      value: "TCP",
      onlyread: true,
    },
    port_or_range: {
      value: "80",
      onlyread: true,
    },
  },
  https: {
    label: "HTTPS",
    protocol: {
      value: "TCP",
      onlyread: true,
    },
    port_or_range: {
      value: "443",
      onlyread: true,
    },
  },
  ftp: {
    label: "FTP",
    protocol: {
      value: "TCP",
      onlyread: true,
    },
    port_or_range: {
      value: "21",
      onlyread: true,
    },
  },
  smtp: {
    label: "SMTP",
    protocol: {
      value: "TCP",
      onlyread: true,
    },
    port_or_range: {
      value: "25",
      onlyread: true,
    },
  },
  imap: {
    label: "IMAP",
    protocol: {
      value: "TCP",
      onlyread: true,
    },
    port_or_range: {
      value: "143",
      onlyread: true,
    },
  },
  pop3: {
    label: "POP3",
    protocol: {
      value: "TCP",
      onlyread: true,
    },
    port_or_range: {
      value: "110",
      onlyread: true,
    },
  },
  dns: {
    label: "DNS",
    protocol: {
      value: "UDP",
      onlyread: true,
    },
    port_or_range: {
      value: "53",
      onlyread: true,
    },
  },
  mysql: {
    label: "MySQL",
    protocol: {
      value: "TCP",
      onlyread: true,
    },
    port_or_range: {
      value: "3306",
      onlyread: true,
    },
  },
  postgresql: {
    label: "PostgreSQL",
    protocol: {
      value: "TCP",
      onlyread: true,
    },
    port_or_range: {
      value: "5432",
      onlyread: true,
    },
  },
  mongodb: {
    label: "MongoDB",
    protocol: {
      value: "TCP",
      onlyread: true,
    },
    port_or_range: {
      value: "27017",
      onlyread: true,
    },
  },
  redis: {
    label: "Redis",
    protocol: {
      value: "TCP",
      onlyread: true,
    },
    port_or_range: {
      value: "6379",
      onlyread: true,
    },
  },
  memcached: {
    label: "Memcached",
    protocol: {
      value: "TCP",
      onlyread: true,
    },
    port_or_range: {
      value: "11211",
      onlyread: true,
    },
  },
  rabbitmq: {
    label: "RabbitMQ",
    protocol: {
      value: "TCP",
      onlyread: true,
    },
    port_or_range: {
      value: "5672",
      onlyread: true,
    },
  },
  elasticsearch: {
    label: "Elasticsearch",
    protocol: {
      value: "TCP",
      onlyread: true,
    },
    port_or_range: {
      value: "9200",
      onlyread: true,
    },
  },
};

export default APPLICATION_OPTIONS;
