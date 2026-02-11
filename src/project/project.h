#ifndef PROJECT_H
#define PROJECT_H
#include <string>
#include <vector>
#include <filesystem>
#include <functional>
#include <mutex>

// Basic functions
std::string get(const std::string &fileName);
std::string search(const std::string &fileContent);
bool add(const std::string &fileName, const std::string &text);
bool DELETE(const std::string &fileName);

// Compression functions
std::string RLECompress(std::string toCompress);
std::string RLEDecompress(std::string toDecompress);

// Helper functions
bool fileContains(const std::filesystem::path &path, const std::string &needle);
void printFileNames(std::vector<std::string> matches);
std::string handleRequest(const std::string &server_request);
std::string sendFileNames(std::vector<std::string> matches);

// Socket functions
int createSocket(int port);
int waitForClient(int serverSock);
std::string receiveData(int clientSock);
bool receiveFromServer(int sock);
bool sendData(int clientSock, const std::string &data);
void handleClient(int clientSock);
void worker();

// Mutex
extern std::mutex project_mutex;

#endif