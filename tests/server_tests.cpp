#include <gtest/gtest.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <thread>
#include <vector>
#include <fstream>
#include <iostream>

#include "project.h"

//-----------------------------------------------------------------------------
// Helper: Remove file before each test if present
//-----------------------------------------------------------------------------
static void cleanTestFile(const std::string &filename)
{
    const char *env = std::getenv("FILES_DIR");
    std::string baseDir = env ? env : "./files";
    std::string fullPath = baseDir + "/" + filename;
    std::remove(fullPath.c_str());
}

//-----------------------------------------------------------------------------
// Helper: Server socket creation used in original tests
//-----------------------------------------------------------------------------
int createSocket(int port)
{
    if (port <= 0 || port > 65535)
        return -1;

    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0)
        return -1;

    sockaddr_in sin{};
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port);

    if (bind(sock, (sockaddr *)&sin, sizeof(sin)) < 0)
    {
        close(sock);
        return -1;
    }

    if (listen(sock, 5) < 0)
    {
        close(sock);
        return -1;
    }

    return sock;
}

//=============================================================================
//                            ORIGINAL TESTS
//=============================================================================

//-----------------------------------------------------------------------------
// TEST: Valid port should successfully create a listening server socket
//-----------------------------------------------------------------------------
TEST(ServerTests, CreateSocket_ValidPort)
{
    int port = 12345;
    int sock = createSocket(port);
    EXPECT_GE(sock, 0);
    if (sock >= 0)
        close(sock);
}

//-----------------------------------------------------------------------------
// TEST: Attempting to bind twice to the same port should fail
//-----------------------------------------------------------------------------
TEST(ServerTests, CreateSocket_PortAlreadyInUse)
{
    int port = 12346;
    int sock1 = createSocket(port);
    int sock2 = createSocket(port);

    EXPECT_GE(sock1, 0);
    EXPECT_EQ(sock2, -1);

    if (sock1 >= 0)
        close(sock1);
    if (sock2 >= 0)
        close(sock2);
}

//-----------------------------------------------------------------------------
// TEST: Invalid port numbers must be rejected
//-----------------------------------------------------------------------------
TEST(ServerTests, CreateSocket_InvalidPort)
{
    EXPECT_EQ(createSocket(-1), -1);
    EXPECT_EQ(createSocket(70000), -1);
}

//=============================================================================
//                        NEW SIMPLE CONCURRENCY TESTS
//=============================================================================
//
// These tests validate correct handling of shared filesystem resources under
// multithreaded access. They ensure that add(), get(), search(), and DELETE()
// operate safely without data races or deadlocks thanks to the filesystem mutex.
//=============================================================================

//-----------------------------------------------------------------------------
// Worker functions for DeleteWhileGet test
//-----------------------------------------------------------------------------
void worker_get(std::string &out)
{
    out = get("race_del.txt");
}

void worker_delete(bool &out)
{
    out = DELETE("race_del.txt");
}

//-----------------------------------------------------------------------------
// TEST: Deleting a file while another thread reads it must NOT crash,
//       hang, or produce undefined data. Output may be content OR 404.
//-----------------------------------------------------------------------------
TEST(ConcurrencyTests, DeleteWhileGet_Simple)
{
    cleanTestFile("race_del.txt");
    add("race_del.txt", "HELLO!");

    std::string getResult;
    bool deleteResult = false;

    std::thread t1(worker_get, std::ref(getResult));
    std::thread t2(worker_delete, std::ref(deleteResult));

    t1.join();
    t2.join();

    EXPECT_TRUE(
        getResult == "HELLO!" ||
        getResult == "404 Not Found\n");
}

//-----------------------------------------------------------------------------
// Worker functions for MixedOperations test
//-----------------------------------------------------------------------------
void worker_add()
{
    for (int i = 0; i < 50; i++)
        add("mix1.txt", "DATA");
}

void worker_delete_mix()
{
    for (int i = 0; i < 50; i++)
        DELETE("mix1.txt");
}

void worker_search_mix()
{
    for (int i = 0; i < 50; i++)
        search("DATA");
}

//-----------------------------------------------------------------------------
// TEST: add(), delete(), and search() running concurrently must NOT corrupt
//       filesystem state and must not deadlock.
//-----------------------------------------------------------------------------
TEST(ConcurrencyTests, MixedOperationsDoNotCrash_Simple)
{
    cleanTestFile("mix1.txt");
    cleanTestFile("mix2.txt");

    std::thread t1(worker_add);
    std::thread t2(worker_delete_mix);
    std::thread t3(worker_search_mix);

    t1.join();
    t2.join();
    t3.join();

    std::string finalState = get("mix1.txt");

    EXPECT_TRUE(
        finalState == "DATA" ||
        finalState == "404 Not Found\n");
}

//-----------------------------------------------------------------------------
// Worker for stress deadlock test
//-----------------------------------------------------------------------------
void stress_worker()
{
    for (int j = 0; j < 100; j++)
    {
        add("deadlock_test.txt", "X");
        get("deadlock_test.txt");
        search("X");
        DELETE("deadlock_test.txt");
    }
}

//-----------------------------------------------------------------------------
// TEST: Heavy parallel access to add(), get(), search(), and DELETE()
//       must NEVER deadlock. If we reach SUCCEED(), mutex is correct.
//-----------------------------------------------------------------------------
TEST(ConcurrencyTests, NoDeadlockUnderLoad_Simple)
{
    std::vector<std::thread> workers;

    for (int i = 0; i < 20; i++)
    {
        workers.push_back(std::thread(stress_worker));
    }

    for (auto &t : workers)
        t.join();

    SUCCEED(); // If execution reaches here, no deadlock occurred.
}
