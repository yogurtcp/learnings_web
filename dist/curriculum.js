// Stable lesson identities, titles, glossary terms and protocol references.
export const lessonMetadata=[
  {
    "id": "ethernet",
    "title": "Frames, switches & Wi-Fi",
    "terms": [
      "MAC address",
      "switch",
      "broadcast",
      "access point"
    ],
    "sources": [
      {
        "title": "RFC 826 · ARP",
        "url": "https://www.rfc-editor.org/rfc/rfc826"
      }
    ]
  },
  {
    "id": "subnets",
    "title": "IPv4 addresses & subnets",
    "terms": [
      "IPv4",
      "prefix",
      "subnet",
      "default gateway"
    ],
    "sources": [
      {
        "title": "RFC 791 · IPv4",
        "url": "https://www.rfc-editor.org/rfc/rfc791"
      }
    ]
  },
  {
    "id": "arp",
    "title": "ARP: finding the next hop",
    "terms": [
      "ARP",
      "neighbor cache",
      "next hop",
      "broadcast"
    ],
    "sources": [
      {
        "title": "RFC 826 · ARP",
        "url": "https://www.rfc-editor.org/rfc/rfc826"
      }
    ]
  },
  {
    "id": "dhcp",
    "title": "DHCP: joining a network",
    "terms": [
      "DHCP",
      "lease",
      "resolver",
      "default gateway"
    ],
    "sources": [
      {
        "title": "RFC 2131 · DHCP",
        "url": "https://www.rfc-editor.org/rfc/rfc2131"
      }
    ]
  },
  {
    "id": "routing",
    "title": "Routing, ICMP & packet size",
    "terms": [
      "route",
      "longest prefix match",
      "TTL",
      "MTU",
      "ICMP"
    ],
    "sources": [
      {
        "title": "RFC 791 · IPv4",
        "url": "https://www.rfc-editor.org/rfc/rfc791"
      },
      {
        "title": "RFC 8200 · IPv6",
        "url": "https://www.rfc-editor.org/rfc/rfc8200"
      }
    ]
  },
  {
    "id": "nat",
    "title": "NAT: sharing an IPv4 address",
    "terms": [
      "NAT",
      "port",
      "flow",
      "private address"
    ],
    "sources": [
      {
        "title": "RFC 3022 · NAT",
        "url": "https://www.rfc-editor.org/rfc/rfc3022"
      }
    ]
  },
  {
    "id": "ipv6",
    "title": "IPv6 & neighbor discovery",
    "terms": [
      "IPv6",
      "Neighbor Discovery",
      "SLAAC",
      "link-local"
    ],
    "sources": [
      {
        "title": "RFC 8200 · IPv6",
        "url": "https://www.rfc-editor.org/rfc/rfc8200"
      },
      {
        "title": "RFC 4861 · IPv6 Neighbor Discovery",
        "url": "https://www.rfc-editor.org/rfc/rfc4861"
      }
    ]
  },
  {
    "id": "tcp-connect",
    "title": "TCP: opening a connection",
    "terms": [
      "TCP",
      "port",
      "socket",
      "handshake"
    ],
    "sources": [
      {
        "title": "RFC 9293 · TCP",
        "url": "https://www.rfc-editor.org/rfc/rfc9293"
      }
    ]
  },
  {
    "id": "tcp-stream",
    "title": "TCP: bytes, loss & congestion",
    "terms": [
      "sequence number",
      "acknowledgement",
      "flow control",
      "congestion control"
    ],
    "sources": [
      {
        "title": "RFC 9293 · TCP",
        "url": "https://www.rfc-editor.org/rfc/rfc9293"
      }
    ]
  },
  {
    "id": "udp",
    "title": "UDP: datagrams & responsibilities",
    "terms": [
      "UDP",
      "datagram",
      "retransmission",
      "QUIC"
    ],
    "sources": [
      {
        "title": "RFC 768 · UDP",
        "url": "https://www.rfc-editor.org/rfc/rfc768"
      },
      {
        "title": "RFC 9000 · QUIC",
        "url": "https://www.rfc-editor.org/rfc/rfc9000"
      }
    ]
  },
  {
    "id": "dns",
    "title": "DNS: delegation & caches",
    "terms": [
      "DNS",
      "recursive resolver",
      "authoritative server",
      "TTL"
    ],
    "sources": [
      {
        "title": "RFC 1034 · DNS",
        "url": "https://www.rfc-editor.org/rfc/rfc1034"
      }
    ]
  },
  {
    "id": "dns-trust",
    "title": "DNS failures & trust",
    "terms": [
      "NXDOMAIN",
      "DNSSEC",
      "DoH",
      "DoT"
    ],
    "sources": [
      {
        "title": "RFC 1034 · DNS",
        "url": "https://www.rfc-editor.org/rfc/rfc1034"
      },
      {
        "title": "RFC 4033 · DNSSEC introduction",
        "url": "https://www.rfc-editor.org/rfc/rfc4033"
      }
    ]
  },
  {
    "id": "tls-identity",
    "title": "TLS: who are you talking to?",
    "terms": [
      "TLS",
      "certificate",
      "certificate authority",
      "hostname"
    ],
    "sources": [
      {
        "title": "RFC 8446 · TLS 1.3 · foundational specification",
        "url": "https://www.rfc-editor.org/rfc/rfc8446"
      }
    ]
  },
  {
    "id": "tls-handshake",
    "title": "TLS: establishing shared secrets",
    "terms": [
      "key exchange",
      "session key",
      "SNI",
      "TLS termination"
    ],
    "sources": [
      {
        "title": "RFC 8446 · TLS 1.3 · foundational specification",
        "url": "https://www.rfc-editor.org/rfc/rfc8446"
      }
    ]
  },
  {
    "id": "http",
    "title": "HTTP: requests, responses & caching",
    "terms": [
      "HTTP",
      "method",
      "status code",
      "cache validator"
    ],
    "sources": [
      {
        "title": "RFC 9110 · HTTP semantics",
        "url": "https://www.rfc-editor.org/rfc/rfc9110"
      },
      {
        "title": "RFC 9111 · HTTP caching",
        "url": "https://www.rfc-editor.org/rfc/rfc9111"
      }
    ]
  },
  {
    "id": "http-versions",
    "title": "HTTP/2, HTTP/3 & QUIC",
    "terms": [
      "multiplexing",
      "HTTP/2",
      "HTTP/3",
      "QUIC"
    ],
    "sources": [
      {
        "title": "RFC 9113 · HTTP/2",
        "url": "https://www.rfc-editor.org/rfc/rfc9113"
      },
      {
        "title": "RFC 9114 · HTTP/3",
        "url": "https://www.rfc-editor.org/rfc/rfc9114"
      },
      {
        "title": "RFC 9000 · QUIC",
        "url": "https://www.rfc-editor.org/rfc/rfc9000"
      }
    ]
  },
  {
    "id": "sessions",
    "title": "Cookies, sessions & origins",
    "terms": [
      "cookie",
      "session",
      "origin",
      "SameSite"
    ],
    "sources": [
      {
        "title": "MDN · HTTP cookies",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies"
      },
      {
        "title": "WHATWG Fetch · CORS protocol",
        "url": "https://fetch.spec.whatwg.org/#http-cors-protocol"
      }
    ]
  },
  {
    "id": "edge",
    "title": "CDNs, proxies & load balancers",
    "terms": [
      "CDN",
      "reverse proxy",
      "load balancer",
      "origin server"
    ],
    "sources": [
      {
        "title": "RFC 9110 · HTTP semantics",
        "url": "https://www.rfc-editor.org/rfc/rfc9110"
      }
    ]
  },
  {
    "id": "firewalls",
    "title": "Firewalls & VPN boundaries",
    "terms": [
      "firewall",
      "stateful filtering",
      "VPN",
      "tunnel"
    ],
    "sources": [
      {
        "title": "RFC 791 · IPv4",
        "url": "https://www.rfc-editor.org/rfc/rfc791"
      },
      {
        "title": "RFC 8446 · TLS 1.3 · foundational specification",
        "url": "https://www.rfc-editor.org/rfc/rfc8446"
      }
    ]
  },
  {
    "id": "captures",
    "title": "Read a packet capture",
    "terms": [
      "capture point",
      "display filter",
      "retransmission",
      "timeline"
    ],
    "sources": [
      {
        "title": "Wireshark · User’s Guide",
        "url": "https://www.wireshark.org/docs/wsug_html_chunked/ChapterIntroduction.html"
      }
    ]
  },
  {
    "id": "spoofing",
    "title": "Spoofing, poisoning & trust",
    "terms": [
      "spoofing",
      "ARP poisoning",
      "DNS poisoning",
      "authentication"
    ],
    "sources": [
      {
        "title": "RFC 826 · ARP",
        "url": "https://www.rfc-editor.org/rfc/rfc826"
      },
      {
        "title": "RFC 1034 · DNS",
        "url": "https://www.rfc-editor.org/rfc/rfc1034"
      },
      {
        "title": "RFC 8446 · TLS 1.3 · foundational specification",
        "url": "https://www.rfc-editor.org/rfc/rfc8446"
      }
    ]
  },
  {
    "id": "availability",
    "title": "DDoS & constrained resources",
    "terms": [
      "DDoS",
      "amplification",
      "rate limiting",
      "bottleneck"
    ],
    "sources": [
      {
        "title": "RFC 768 · UDP",
        "url": "https://www.rfc-editor.org/rfc/rfc768"
      },
      {
        "title": "RFC 9293 · TCP",
        "url": "https://www.rfc-editor.org/rfc/rfc9293"
      }
    ]
  },
  {
    "id": "capstone",
    "title": "From URL to evidence",
    "terms": [
      "dependency",
      "evidence",
      "hypothesis",
      "return path"
    ],
    "sources": [
      {
        "title": "RFC 791 · IPv4",
        "url": "https://www.rfc-editor.org/rfc/rfc791"
      },
      {
        "title": "RFC 9110 · HTTP semantics",
        "url": "https://www.rfc-editor.org/rfc/rfc9110"
      },
      {
        "title": "Wireshark · User’s Guide",
        "url": "https://www.wireshark.org/docs/wsug_html_chunked/ChapterIntroduction.html"
      }
    ]
  }
];
