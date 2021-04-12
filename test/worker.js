
const { strict: Assert} = require("assert");
const PosixSocketMessaging = require("../lib/index.js");
const PosixSocket = require("posix-socket");

const port = parseInt(process.argv[2]);

console.log("Client creating socket...");

const sockfd = PosixSocket.socket(PosixSocket.AF_INET6, PosixSocket.SOCK_STREAM, 0);

console.log("Client created socket:", sockfd);

console.log("Client connecting...");

console.log("Client connected:", PosixSocket.connect(sockfd, {
  sin6_family: PosixSocket.AF_INET6,
  sin6_port: port,
  sin6_flowinfo: 0,
  sin6_addr: "::1",
  sin6_scope_id: 0
}));

Assert.throws(
  () => PosixSocketMessaging.send(sockfd, "x".repeat(PosixSocketMessaging.getMaxByteLength() + 1)),
  /^Error: The message length is too large/);

console.log("Client sending...");

let message = "x".repeat(64*2**10);

PosixSocketMessaging.send(sockfd, message);

console.log("Client sent:", message.length, message.substring(0, 10), "...");

console.log("Client receiving...");

message = PosixSocketMessaging.receive(sockfd);

console.log("Client received:", message.length, message.substring(0, 10), "...");

console.log("Client closing...");

console.log("Client closed:", PosixSocket.close(sockfd));
