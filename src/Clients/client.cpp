#include <iostream>
#include <sstream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include "project.h"
#include <netdb.h>

using namespace std;

int main(int argc, char *argv[]) // recieves IP and port=
{
    // socket info
    // const char *ip_address = argv[1];
    const char *host = argv[1];
    const int port_no = stoi(argv[2]);
    struct hostent *he = gethostbyname(host);

    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0)
    {
        return -1;
    }
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_port = htons(port_no);
    sin.sin_addr = *((struct in_addr *)he->h_addr);

    // connect socket
    if (connect(sock, (struct sockaddr *)&sin, sizeof(sin)) < 0)
    {
        return -1;
    }

    // loop of communication with server
    while (true)
    {
        std::string input;
        std::getline(std::cin, input);

        if (input.empty())
            continue;

        // add "\n" to string
        input += "\n";

        // send input to server
        int sent_bytes = send(sock, input.c_str(), input.size(), 0);
        if (sent_bytes < 0)
        {
            break; // stop if send fails
        }

        // waiting to recieve data and check if server closed connection (=false)
        if (receiveFromServer(sock) == false)
        {
            break;
        }
    }

    close(sock);

    return 0;
}

// read input from server
bool receiveFromServer(int sock)
{
    char buffer[4096];
    int bytesRead = recv(sock, buffer, sizeof(buffer) - 1, 0);

    // when server sends data
    if (bytesRead > 0)
    {
        std::cout << std::string(buffer, bytesRead);
        return true;
    }

    // server closed connection
    if (bytesRead == 0)
    {
        return false;
    }

    return false; // error
}