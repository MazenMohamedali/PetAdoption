import http from 'http';

// This is our MCP server
// It exposes one tool: "calculate"
// When called, it performs basic math and returns the result

const tools = {
  calculate: ({ operation, a, b }) => {
    switch (operation) {
      case 'add':      return { result: a + b };
      case 'subtract': return { result: a - b };
      case 'multiply': return { result: a * b };
      case 'divide':   return { result: a / b };
      default: return { error: 'Unknown operation' };
    }
  }
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'MCP Server is running' }));
    return;
  }

  if (req.method === 'POST' && req.url === '/tools/call') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { tool, parameters } = JSON.parse(body);
      console.log(`Tool called: ${tool}`, parameters);

      if (tools[tool]) {
        const result = tools[tool](parameters);
        console.log(`Result:`, result);
        res.writeHead(200);
        res.end(JSON.stringify(result));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Tool not found' }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(4000, () => {
  console.log('MCP Server running on http://localhost:4000');
  console.log('Available tools: calculate');
});