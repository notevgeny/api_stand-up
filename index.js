import http from "node:http";
import fs from "node:fs/promises";

const PORT = 8080;


http
    .createServer(async (request, response) => {
        if (request.method === "GET" && request.url === '/comedians'){
            try {
                const data = await fs.readFile('comedians.json', 'utf-8');
                response.writeHead(200, {
                    "Content-type": "text/json; charset=utf-8",
                    "Access-Control-Allow-Origin": "*",
                })
                response.end(data);

            } catch (error) {
                response.writeHead(500, {
                    "Content-type": "text/plain; charset=utf-8",
                });
                response.end(`Server ошибка error: ${error}`);
            }
            
            
        }
        else {
            response.writeHead(404);
            response.end('<h1>Not found</h1>');
        }
        
    })
    .listen(PORT);

    console.log(`Server is running on http://localhost:${PORT}`);
