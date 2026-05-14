import http from 'http';
import readline from 'readline';

function askQuestion(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => {
    rl.question(prompt, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

function callMCPServer(toolName, parameters) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ tool: toolName, parameters });
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/tools/call',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function simulateLLM(question) {
  console.log('\n[LLM] Received question:', question);
  console.log('[LLM] Analyzing question...');
  console.log('[LLM] Deciding to call tool: calculate');

  const numbers = question.match(/\d+/g).map(Number);
  let operation = 'add';
  if (question.includes('*') || question.toLowerCase().includes('multipl')) operation = 'multiply';
  else if (question.includes('/') || question.toLowerCase().includes('divid')) operation = 'divide';
  else if (question.includes('-') || question.toLowerCase().includes('subtract')) operation = 'subtract';
  else if (question.includes('+') || question.toLowerCase().includes('add')) operation = 'add';

  return {
    tool: 'calculate',
    parameters: { operation, a: numbers[0], b: numbers[1] }
  };
}

async function main() {
  const userQuestion = await askQuestion('Ask a math question: ');
  console.log('---');

  // Step 1: LLM decides what tool to call
  const llmDecision = simulateLLM(userQuestion);
  console.log('[LLM] Sending request to MCP server...');

  // Step 2: Call MCP server
  const mcpResult = await callMCPServer(llmDecision.tool, llmDecision.parameters);
  console.log('[MCP Server] Function executed, result:', mcpResult);

  // Step 3: LLM forms final answer
  console.log('---');
  console.log(`[LLM] Final answer: The result of ${llmDecision.parameters.a} ${llmDecision.parameters.operation} ${llmDecision.parameters.b} is ${mcpResult.result}`);
}

main().catch(console.error);