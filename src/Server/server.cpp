#include <iostream>
#include <string>
#include <sstream>
#include "project.h"
#include <cstring>
#include <streambuf>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <functional>
#include <thread>
#include <condition_variable>
#include <queue>

using namespace std;

std::queue<int> clients;
std::mutex mtx;
std::condition_variable cv;

int main(int argc, char *argv[])
{
    std::string input;

    // socket information from arguments
    int port = std::stoi(argv[1]);

    // attempt to create socket, return if fails
    int serverSock = createSocket(port);
    if (serverSock < 0)
        return 1;

    const int THREAD_COUNT = 5;
    std::vector<std::thread> pool;

    // create threads
    for (int i = 0; i < THREAD_COUNT; i++)
        pool.emplace_back(worker);

    // client connection loop
    while (true)
    {
        int clientSock = waitForClient(serverSock);
        if (clientSock < 0)
            continue;

        {
            std::lock_guard<std::mutex> lock(mtx);
            clients.push(clientSock);
        }
        cv.notify_one();
    }
    return 0;
}

void worker()
{
    while (true)
    {
        int clientSock;

        {
            std::unique_lock<std::mutex> lock(mtx);
            cv.wait(lock, []
                    { return !clients.empty(); });

            clientSock = clients.front();
            clients.pop();
        }

        // handling client
        handleClient(clientSock);
    }
}

void handleClient(int clientSock)
{
    // loop through inputs and outputs
    while (true)
    {
        try
        {
            std::string input = receiveData(clientSock);
            if (input.empty())
                break; // client disconnected;

            std::string output = handleRequest(input);
            sendData(clientSock, output);
        }
        catch (...)
        {
            // if any fails, send internal error
            sendData(clientSock, "500 Internal Server Error\n");
        }
    }

    close(clientSock);
}

// create socket function
int createSocket(int port)
{
    // create the socket
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0)
    {
        return -1;
    }

    // get info for binding
    sockaddr_in sin{};
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port);

    // bind
    if (bind(sock, (sockaddr *)&sin, sizeof(sin)) < 0)
    {
        close(sock);
        return -1;
    }

    // listen to socket
    if (listen(sock, 5) < 0)
    {
        close(sock);
        return -1;
    }

    return sock; // server socket ready
}

// wait for client to connect
int waitForClient(int serverSock)
{
    sockaddr_in clientAddr{};
    socklen_t clientLen = sizeof(clientAddr);
    // start connection
    int clientSock = accept(serverSock, (sockaddr *)&clientAddr, &clientLen);
    if (clientSock < 0)
    {
        return -1;
    }

    return clientSock;
}

// recieve input from client
std::string receiveData(int clientSock)
{
    char buffer[4096];
    memset(buffer, 0, sizeof(buffer));
    // read data
    ssize_t bytesRead = recv(clientSock, buffer, sizeof(buffer) - 1, 0);

    if (bytesRead < 0)
    {
        return "";
    }

    if (bytesRead == 0)
    {
        // client disconnected
        return "";
    }

    return std::string(buffer, bytesRead);
}

// send data to client
bool sendData(int clientSock, const std::string &data)
{
    int bytesSent = send(clientSock, data.c_str(), data.size(), MSG_NOSIGNAL);
    if (bytesSent < 0)
    {
        // if not sent return false
        return false;
    }
    return true;
}