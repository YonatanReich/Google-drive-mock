const net = require('net');

const port = 5555;
const server = "server";

class Client {
    //Send a request to the CPP server
    static request(passToServer) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            let serverResponse = '';

            //connect to the server and send the command
            client.connect(port, server, () => {
                const buffer = Buffer.from(passToServer + "\n", 'utf-8');
                client.write(buffer);
            });

            //when reciving data, send the response back to the MVC client
            client.on('data', (chunk) => {
                serverResponse += chunk.toString();
                if (serverResponse.includes('\n')) {
                    client.destroy();
                    resolve(serverResponse.trim());
                }
            });

            //send error if failed
            client.on('error', (err) => {
                reject(new Error(`TCP Service Error: ${err.message}`));
            });

            // Safety timeout
            client.setTimeout(5000, () => {
                client.destroy();
                reject(new Error("Server timed out"));
            });
        });
    }

    // function to upload a file to the C++ server
    static async uploadfile(filename, content) {
        const passToServer = `POST ${filename} ${content}`;
        //For debugging!
        console.log(passToServer)
        const serverRespone = await this.request(passToServer);
        //Might need to return something else
        return serverRespone;
    }


    // function to delete a file from the C++ server
    static async deleteFile(fileId) {
        const passToServer = `DELETE ${fileId}`;

        // for debugging
        console.log(passToServer);

        // receive the response and return it
        const serverResponse = await this.request(passToServer);
        console.log("Delete response: ", serverResponse);
        return serverResponse;
    }


    // function to get a file content from the C++ server
    static async getFile(fileId) {
        const passToServer = `GET ${fileId}`;

        // for debugging
        console.log("=== CPP CLIENT GET ===");
        console.log("Request:", passToServer);

        // receive the response, clean and return it
        const serverResponse = await this.request(passToServer);
        console.log("Raw response:", JSON.stringify(serverResponse));
        console.log("Response length:", serverResponse.length);
        
        let cleanedResult = serverResponse.replace(/^200(\s*OK)?\s*/i, "");
        cleanedResult = cleanedResult.trim();
        
        console.log("Cleaned result:", JSON.stringify(cleanedResult));
        console.log("Cleaned length:", cleanedResult.length);
        console.log("======================");
        
        return cleanedResult;
    }


    // function to update a file (patch) on the C++ server
    static async updateFile(fileId, newContent) {
        console.log("Patching file: ", fileId);

        await this.deleteFile(fileId);
        // receive the response and return it
        const serverResponse = await this.uploadfile(fileId, newContent);
        return serverResponse;
    }



    // function to search a match between query to file content in C++ server
    static async search(query) {
        // sending the message to C++
        const passToServer = `SEARCH ${query}`;

        // for debugging        
        console.log(passToServer);

        // receive the response and return it
        const serverResponse = await this.request(passToServer);
        let searchResultsArray = serverResponse.trim().split(/\s+/);
        return searchResultsArray;
    }
}

module.exports = Client;
