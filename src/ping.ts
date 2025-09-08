import fetch from "node-fetch";

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
