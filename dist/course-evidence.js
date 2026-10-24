// Inputs for self-contained recall. These are authored givens, not answer keys.
export const questionEvidence={
 ethernet:[
 'VLAN 10; forwarding table empty.\nLaptop frame arrives on port 2: src …:10, dst …:50.\nPrinter …:50 is physically attached to port 5.',
 'Laptop connected by Wi-Fi; printer connected to the LAN switch.\nThe home box combines access point, switch and router.\nISP connection is down.',
 'A frame arrives from a new device presenting the printer’s source MAC …:50.'
 ],
 subnets:[
 'Laptop: 192.168.1.70/26\nDestinations to classify: 192.168.1.120 and 192.168.1.130',
 'Laptop: 192.168.1.70/26\nConnected route: 192.168.1.64/26\nDefault: via 192.168.1.65\nDestination: 192.168.1.130',
 'A: 192.168.1.70/26\nB: 192.168.1.130/24\nBoth connected to the same ordinary Ethernet switch.'
 ],
 arp:[
 'Laptop .10/24; remote destination 198.51.100.20.\nDefault route via 192.168.1.1.\nNeighbor cache has no usable entry for .1.',
 'A web request succeeds. The capture contains its IP traffic but no ARP request.\nCapture start time and previous neighbor state have not been checked.',
 'DNS returned 198.51.100.20.\nRoute selects gateway 192.168.1.1.\nNeighbor entry for .1 remains unresolved.'
 ],
 dhcp:[
 'New IPv4 client has joined the local link but has no ordinary usable address.\nA DHCP server or relay is available on that link.',
 'Acknowledged lease: .42/24; router .1; DNS resolver .53.\nAn internal service is reachable. Queries to .53 obtain no usable reply.',
 'Expected default router: .1\nAn unwanted DHCP offer supplies router .99 and an unwanted resolver.'
 ],
 routing:[
 '198.51.100.0/24 → A\n198.51.100.128/25 → B\n0.0.0.0/0 → C\nDestination: 198.51.100.150',
 'Same host: ICMP echo times out; a valid HTTPS request returns 200.',
 'Small exchanges succeed. A larger IPv4 packet is 1500 bytes with DF set.\nA later link has MTU 1400.'
 ],
 nat:[
 'Recorded mappings:\n203.0.113.5:62001 ↔ 192.168.1.10:53000\n203.0.113.5:62002 ↔ 192.168.1.11:53000\nReply destination: 203.0.113.5:62001',
 'Internet → ISP NAT → home NAT → laptop.\nHome forwards port 65000. No upstream inbound mapping is configured.',
 'IPv6 host has a globally usable address and a stateful firewall.\nNo address-sharing NAT is present.'
 ],
 ipv6:[
 'IPv6 forwarding works. The local trace contains Neighbor Solicitation and Advertisement, but no ARP.',
 'A new firewall rule discards every ICMPv6 message.\nSome ordinary application connections then fail.',
 'Router Advertisement: lifetime 1800 s; prefix 2001:db8:42:1::/64, A=1, L=1.\nDHCPv6 service is also available.'
 ],
 'tcp-connect':[
 'Client :53000 → :443 SYN seq=1000\nServer → client SYN,ACK seq=7000 ack=1001\nClient → server ACK ack=7001',
 'TCP opening completes.\nBrowser then reports TLS certificate hostname mismatch.\nNo successful HTTP exchange has been observed.',
 'Client SYN sequence number: 1000.\nNo application data bytes are included in that SYN.'
 ],
 'tcp-stream':[
 'Application writes: "HELLO", then "WORLD".\nTransport: TCP.',
 'Received 1000–1099.\nMissing 1100–1199.\nReceived 1200–1299.',
 'Advertised receiver space: 64 KiB.\nPath bottleneck shows congestion signals.'
 ],
 udp:[
 'Sent position updates #100 x=10, #101 x=11, #102 x=12.\nArrival: #102, then #100. #101 is absent.',
 'Stack: HTTP/3 → QUIC → UDP.\nMissing stream data is later recovered.',
 'UDP send for request id=73 succeeded locally.\nNo remote response has yet been observed.'
 ],
 dns:[
 'Client asks its recursive resolver for A www.docs.example.\nAssume no relevant cached answer or referral.\nThe namespace here is fictional.',
 '10:00: resolver caches .20 with TTL 300 s.\n10:01: authoritative record changes to .21.\n10:02: another lookup uses the first resolver.',
 'DNS record: TTL 300.\nAn IPv4 packet also has a field called TTL.'
 ],
 'dns-trust':[
 'User A receives NXDOMAIN.\nUser C receives no usable lookup reply before timeout.',
 'Client sends its query over DoH to the chosen recursive resolver.\nNo separate data validation has been established by this observation.',
 'One configuration enables DoH/DoT.\nAnother validates signed DNS data with DNSSEC.'
 ],
 'tls-identity':[
 'Attacker has a copy of the public accounts.example certificate.\nNo corresponding private key or trust-system compromise is given.',
 'Hostname URL works.\nChanging it to a bare IP produces a certificate error.\nThe certificate covers the hostname.',
 'account-help.example is attacker controlled and presents a valid certificate for that name.\nThe intended service is accounts.example.'
 ],
 'tls-handshake':[
 'Fresh TLS 1.3 example: key shares, authenticated server handshake, derived symmetric traffic keys.',
 'Browser ═ TLS A ═ CDN edge ═ separate TLS B ═ origin.',
 'Observer is on the network path, outside the TLS endpoints.\nApplication content is encrypted.'
 ],
 http:[
 'Stored /notes: 12 KiB, ETag "v7".\nGET includes If-None-Match: "v7".\nResponse: 304 Not Modified.',
 'Browser receives an actual HTTPS 500 response.\nThe identity of the responding service or proxy must still be established.',
 'Two names, docs.example and shop.example, share an IP endpoint.\nThe requests intend different websites.'
 ],
 'http-versions':[
 'HTTP/2 streams share a TCP connection.\nTCP bytes 1100–1199 missing; later stylesheet bytes have arrived.',
 'HTTP/3 over QUIC.\nStream A has a gap; stream B data has arrived.',
 'Usable UDP is blocked. TCP 443 remains reachable.\nClient/server support for alternative HTTP versions must be checked.'
 ],
 sessions:[
 'sid is a bearer session identifier.\nOriginal HTTPS transit is protected, but sid leaked through another boundary.',
 'Set-Cookie: sid=demo-session; Secure; HttpOnly; SameSite=Lax; Path=/',
 'Page and API have different origins.\nAPI logs a received request and 200 response.\nBrowser script reports a CORS access error.'
 ],
 edge:[
 'Browser requests /guide from a CDN edge.\nEdge has a fresh eligible cached copy.\nBrowser load succeeds; origin log has no corresponding request.',
 'Browser receives 502 from the public edge.\nThe edge reports an unusable upstream result.',
 'Origin accepts X-Forwarded-For without checking whether the caller is a trusted proxy.'
 ],
 firewalls:[
 'Allowed outbound: laptop:53000 → server:443.\nInbound A: matching reply.\nInbound B: unrelated new connection to laptop:22.',
 'Laptop ═ protected VPN tunnel ═ gateway → onward network.\nBrowser may also use HTTPS.',
 '10.20.0.0/16 → VPN interface\ndefault → home gateway\nDestinations: 10.20.4.8 and an ordinary public service.'
 ],
 captures:[
 'LAPTOP CAPTURE\n0.000 DNS answer A 198.51.100.20\n0.010 SYN → 443\n0.030 SYN,ACK ←\n0.031 ACK →\n0.040 TLS ClientHello →\n0.070 TLS alert ← (details not yet inspected)',
 'Current display filter: tcp.\nNo DNS appears in the visible list.\nCapture start time, capture filter and local caches are not yet checked.',
 'Laptop capture: source 192.168.1.10.\nRemote-side capture: another source address or another connection.\nThe intervening topology includes NAT or a terminating proxy.'
 ],
 spoofing:[
 'False lookup points accounts.example to an attacker endpoint.\nBrowser still expects accounts.example with correct TLS validation.',
 'Off-path sender X puts source Y in a packet sent to responder Z.\nNo observation of Z’s replies is given.',
 'ARP case: .1 mapping changes from MAC …:01 to …:99.\nDNS case: accounts.example resolves to an unwanted IP.'
 ],
 availability:[
 'Access link capacity 100 Mb/s; unwanted offered traffic exceeds it.\nServer CPU mostly idle; users time out.',
 'Traffic traverses a saturated access link before reaching host drop rules.',
 'Toy system: 20 workers, 2 seconds of occupancy per request.\nArrival rate: 15 expensive requests per second.'
 ],
 capstone:[
 'Configured laptop; fresh HTTPS-over-TCP request.\nNo relevant caches or reusable connection assumed.\nURL: https://reports.example/monthly',
 'DNS answer and TCP opening succeeded.\nExpected name: reports.example.\nTLS reports certificate hostname mismatch.',
 'Attempt A: TCP completes, then TLS hostname mismatch; no shown HTTP success.\nAttempt B: valid HTTPS response from edge, status 502.'
 ]
};
