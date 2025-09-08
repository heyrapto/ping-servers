import fetch from "node-fetch";
import http from "node:http";

const servers = [
  "https://raptomx-portfolio-server.onrender.com/api/health",
];

async function pingServers() {
  const results = await Promise.allSettled(
    servers.map(async (server) => {
      const start = Date.now();
      try {
        const res = await fetch(server, { method: "GET" });
        const latency = Date.now() - start;

        return {
          server,
          status: res.status,
          latency: `${latency}ms`,
          ok: res.ok
        };
      } catch (err) {
        return {
          server,
          status: "DOWN",
          latency: "N/A",
          ok: false,
          error: err instanceof Error ? err.message : String(err)
        };
      }
    })
  );

  console.table(results.map(r => r.status === 'fulfilled' ? r.value : r.reason));
}

setInterval(pingServers, 30000);

pingServers();

const desiredPort = process.env.PORT ? Number(process.env.PORT) : 0; 
const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("OK");
});

server.on("error", (err: any) => {
  if (err && err.code === "EADDRINUSE" && !process.env.PORT) {
    server.listen(0);
    return;
  }
  throw err;
});

server.listen(desiredPort, () => {
  const address = server.address();
  const actualPort = typeof address === "object" && address ? (address as any).port : desiredPort;
  console.log(`HTTP server listening on port ${actualPort}`);
});
