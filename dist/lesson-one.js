// Concrete opening lesson; stable lesson/card identifiers preserve existing progress.
export const openingLesson = {
  "id": "layers",
  "title": "Make your browser ask for a file",
  "summary": "Send a real request from this lesson, read the reply, and explain the delivery jobs hidden behind one click.",
  "terms": [
    "HTTP",
    "protocol",
    "TCP",
    "TLS",
    "packet",
    "frame",
    "encapsulation"
  ],
  "sections": [
    {
      "title": "Ask this web server for one tiny file",
      "text": "Click “Send a real request” below. Your browser will ask this app’s web service for a small text file called /lesson-demo.txt. It is the same basic application-level action as asking for a page, an image, or some JSON. You will see the actual status, content type and text that return.\n\nRead the example request above as a sentence: “Get the resource /lesson-demo.txt from this website.” GET is the operation, the path identifies the resource, and Host identifies the website. That last part matters because several websites can share one server address. The blank line ends the request’s header section. This example has no request body.\n\nThe server answers with a status, fields describing the response, and a body containing the requested text. A 200 status reports success for this request. Content-Type tells the receiver how to interpret the body. The body is the text you came for; it is a different part of the message from those instructions about it.\n\nThat agreement is HTTP. Calling it a “protocol” means the browser and web service agree how to express requests and replies. They can be written in completely different programming languages and still communicate because both understand that agreement.",
      "evidence": {
        "label": "A readable HTTP/1.1 request",
        "before": true,
        "code": "GET /lesson-demo.txt HTTP/1.1\nHost: packet-path.yogurt-co.chatgpt.site\n\n",
        "caption": "A deliberately minimal HTTP/1.1 representation. The live button may use HTTP/2 or HTTP/3, whose wire encoding differs. These are meaningful request fields, not a claim that this text is a packet capture.",
        "annotations": [
          [
            "GET",
            "Ask for a representation of the resource."
          ],
          [
            "/lesson-demo.txt",
            "Which resource on this website? A path is not an IP address."
          ],
          [
            "Host",
            "Which website is being addressed?"
          ],
          [
            "Blank line",
            "The HTTP/1.1 header section ends here."
          ]
        ]
      },
      "liveRequest": true
    },
    {
      "title": "Why “GET this file” is not enough to deliver it",
      "text": "Look at that request again: it says which file to get, but it does not supply every instruction needed to move bytes between two machines. Imagine sending the request to a computer on another continent. Which computer should receive it? Which service on that computer? What happens if some data is lost? Can someone along the route read or alter it?\n\nHere is one concrete arrangement: HTTPS using HTTP/1.1 over TCP. DNS supplies an address associated with the website’s name. IP packets carry the destination address so routers can forward them toward that endpoint. TCP ports distinguish endpoints, such as a client’s temporary port and the server’s listening port 443. TCP also provides ordered byte delivery and loss recovery. TLS protects the application conversation and checks the server’s identity under the browser’s trust rules.\n\nEach part exists because the HTTP sentence leaves a different problem unanswered. A perfect GET request cannot fix a route to the wrong place. Reaching port 443 cannot fix a certificate for the wrong hostname. Encrypting bytes cannot tell the web application which file you want. The pieces work together rather than replacing one another.\n\nThe table is an authored example with documentation addresses, not a measurement of your device. The live request shows actual HTTP results; a browser script does not expose all the underlying packet fields. Its successful connection may also be reused, so clicking twice does not necessarily perform two new handshakes.",
      "evidence": {
        "label": "Follow the jobs in one example",
        "code": null,
        "annotations": [
          [
            "DNS: name → an address",
            "Find an address for the service; it does not fetch the file."
          ],
          [
            "IP destination: 198.51.100.20",
            "Identify the remote destination for packet forwarding."
          ],
          [
            "TCP: client port 53000 → server port 443",
            "Identify this connection’s endpoints and carry ordered bytes."
          ],
          [
            "TLS: protected application data",
            "Protect the conversation and authenticate the intended server under the configured trust model."
          ],
          [
            "HTTP: GET /lesson-demo.txt",
            "Tell the web service which resource you want."
          ]
        ]
      }
    },
    {
      "title": "Why your router receives a packet meant for a server",
      "text": "Suppose your laptop is 192.168.1.10 and your home router is 192.168.1.1. You want to contact server 198.51.100.20, which is outside your local network. Your laptop has a route saying to send that traffic through the home router. It cannot transmit a local Ethernet frame directly to a machine across the world.\n\nSo the same outgoing transmission answers two different delivery questions. Its IP destination is 198.51.100.20: the remote endpoint you want. Its first Ethernet destination is the home router’s MAC address: the neighbor that can take the next step. The router is allowed to receive a local frame without being the final IP destination. That is how the request can leave the local network.\n\nAt the router, the incoming link envelope is removed. The router examines the IP packet, chooses an onward next hop and wraps the packet for that outgoing link. The local envelope is replaced along the route. In this first-link example, the packet’s destination IP remains the remote server. Address translation can also change IP fields in some networks, so avoid treating “every address stays fixed” as the rule.\n\nNow the vocabulary has something to attach to. An IP packet carries network-delivery information. An Ethernet frame carries local-link delivery information around that packet. Putting one inside the other is encapsulation. The extra wrapper is useful because “where am I ultimately going?” and “who can receive me on this link?” are different questions.",
      "evidence": {
        "label": "Inspect the laptop’s first Ethernet transmission",
        "code": "Ethernet destination: 02:00:00:00:00:01  (home router)\n└─ IP destination:    198.51.100.20       (web server)\n   └─ TCP destination port: 443\n      └─ TLS-protected data carries the HTTP request",
        "caption": "An authored first-link example. The addresses are illustrative. The HTTPS request is inside protected application data; it would not appear as readable GET text in an ordinary encrypted packet capture.",
        "annotations": [
          [
            "Router MAC",
            "Deliver this frame to the local router interface."
          ],
          [
            "Server IP",
            "Keep forwarding toward this remote endpoint."
          ]
        ]
      }
    },
    {
      "title": "Read an outcome as evidence, not just “works” or “broken”",
      "text": "Suppose the Wi-Fi icon is lit, but the browser cannot resolve the website’s name. The laptop has a wireless connection; that observation does not show that its configured DNS resolver is working. The HTTP request might never have been sent to the intended service. Checking the spelling and resolver response is more informative than restarting the web application.\n\nNow suppose a request receives a real HTTP 404 response. Some HTTP endpoint answered and reported that it could not supply the requested resource. That is a very different observation from a DNS timeout. Enough of the path worked to exchange an application response with that endpoint. On HTTPS, the protected connection also worked sufficiently for that response. A proxy could be the responder, so this alone does not prove every origin service is healthy.\n\nClick the live request twice. Both clicks can obtain a new response while using an already-resolved name and an existing connection. This experiment asks for a network response instead of using the browser’s ordinary HTTP response cache. It does not force a new DNS lookup, TCP opening or TLS handshake. A remote serving cache may also answer without contacting an origin application.\n\nThe useful habit is to ask: what exactly did I observe, which dependency does it confirm, and which question remains open? You can reason about a concrete failure before knowing every field in every protocol. The three questions next ask you to use this habit, not recite the word “encapsulation.”",
      "evidence": {
        "label": "Three observations, three different conclusions",
        "code": null,
        "annotations": [
          [
            "Wi-Fi says “connected”",
            "You have evidence of a local wireless connection. DNS and remote service availability are still open questions."
          ],
          [
            "Name lookup times out",
            "No usable reply arrived in the wait period. Check the resolver and path; this is not proof that the web application is down."
          ],
          [
            "HTTP 404 arrives",
            "An HTTP endpoint answered. Investigate the requested resource and responding service rather than claiming that all networking failed."
          ]
        ]
      }
    }
  ],
  "trace": "Authored first-link example for HTTPS over TCP\n\nRequest meaning: GET /lesson-demo.txt\nIP destination: 198.51.100.20 (remote web endpoint)\nFirst Ethernet recipient: home router’s MAC\nTCP and TLS carry/protect the HTTP exchange\nOutcome: an HTTP status, response fields and body",
  "example": [
    "You want /lesson-demo.txt, so HTTP expresses which resource the service should return.",
    "An address and a route are needed to send toward that service. The local frame goes to the selected next hop, while the IP packet names the remote destination.",
    "In this TCP-based example, TCP supplies an ordered byte stream and TLS protects the application conversation and checks server identity.",
    "Read the returned status and body. A real HTTP error is evidence that an endpoint answered; it differs from receiving no DNS or transport response.",
    "On another request, cached name data or a reused connection can remove setup exchanges without removing the new HTTP request."
  ],
  "trap": "Do not treat the Wi-Fi icon, a TCP connection and an HTTP response as equivalent evidence. Each confirms a different part of the journey. Also, the live HTTP experiment is not a packet capture: it does not show your MAC addresses, TCP sequence numbers or encrypted bytes.",
  "questions": [
    {
      "kind": "Explain",
      "prompts": [
        "In the example, the server is 198.51.100.20 but the first Ethernet frame goes to the home router. Explain why both destinations are needed.",
        "Your GET is meant for 198.51.100.20. Explain the final destination versus the next hop using the IP destination and the router’s MAC."
      ],
      "answer": "The server IP answers where the packet should ultimately be delivered. The router’s MAC answers who receives the first frame on this local Ethernet link. The router can receive that frame, remove its local wrapper, inspect the IP packet and forward it toward another next hop. Sending the frame to the router does not turn the router into the web server. The local envelope changes as the packet crosses links.",
      "checks": [
        "The server IP identifies the remote endpoint",
        "The router MAC identifies the recipient on the first local link",
        "The router removes and replaces the local envelope when forwarding"
      ]
    },
    {
      "kind": "Diagnose",
      "prompts": [
        "The Wi-Fi icon says connected, but the browser reports a name-resolution failure. What has the icon established, and what would you investigate next?",
        "Your laptop joins Wi-Fi successfully but cannot look up the website’s name. Explain why this is possible and propose a useful next check."
      ],
      "answer": "Joining Wi-Fi establishes a local wireless connection, not successful name resolution or access to the intended web service. Check the exact name and the configured resolver’s response and reachability. Address configuration and routes can also affect reaching that resolver. If no address can be obtained for a fresh request, the browser may never contact the intended web endpoint. The icon alone cannot tell you that the web application is healthy or broken.",
      "checks": [
        "Local wireless connectivity is narrower than end-to-end success",
        "Name resolution and the path to the resolver can still fail",
        "Propose a concrete lookup/configuration check rather than concluding the web server is down"
      ]
    },
    {
      "kind": "Predict",
      "prompts": [
        "You click the live request twice and both clicks receive a response. Why might the second request produce no new DNS lookup or TCP opening?",
        "A second GET returns fresh text, but the trace has no fresh DNS exchange or TCP handshake. Explain how that can be normal."
      ],
      "answer": "The browser may already have a usable name-to-address result and a connection it can reuse for another request. A new HTTP response therefore does not imply every setup step happened again. In ordinary browsing, stored response content can sometimes avoid the network entirely; this lesson’s live button deliberately requests a network response, while still allowing DNS and connection reuse. A remote cache can also supply the response.",
      "checks": [
        "Cached DNS can avoid another lookup",
        "An existing connection can carry a new request",
        "Distinguish reused setup from a locally cached HTTP response"
      ]
    }
  ],
  "sources": [
    {
      "title": "MDN · HTTP messages, with request and response examples",
      "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages"
    },
    {
      "title": "RFC 9110 · HTTP semantics",
      "url": "https://www.rfc-editor.org/rfc/rfc9110"
    },
    {
      "title": "RFC 791 · IP delivery",
      "url": "https://www.rfc-editor.org/rfc/rfc791"
    }
  ]
};
