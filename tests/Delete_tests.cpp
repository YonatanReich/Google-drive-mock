#include <gtest/gtest.h>
#include "project.h"
#include <fstream>

TEST(DeletefileTest, deleteExistingFile)
{
    // Setup: create a temporary file to delete
    const char *env = std::getenv("FILES_DIR");
    std::string baseDir = env ? std::string(env) : "./files";
    std::string testFilePath = baseDir + "/testfile100.txt";

    // Create the file
    std::ofstream ofs(testFilePath);
    ofs << "This is a test file." << std::endl;
    ofs.close();

    // Execute DELETE function
    int result = DELETE("testfile100.txt");

    // Verify the file was deleted
    EXPECT_EQ(result, true);
    std::ifstream ifs(testFilePath);
    EXPECT_FALSE(ifs.good());
}

TEST(DeleteFileTest, deleteNoneExistingFile)
{
    // Dont delete file that does not exist
    int result = DELETE("ThisFileDoesNotExist.txt");
    EXPECT_EQ(result, false);
}

TEST(DeleteFileTest, deleteWithoutFileName)
{
    // dont attempt to delete file without file name
    int result = DELETE("");
    EXPECT_EQ(result, false);
}

TEST(DeleteFileTest, deleteFileTwice)
{
    // Make sure file can only be delete once
    const char *env = std::getenv("FILES_DIR");
    std::string baseDir = env ? std::string(env) : "./files";
    std::string doubleDeleteFilepath = baseDir + "/testfile200.txt";

    std::ofstream file(doubleDeleteFilepath);
    file << "This is a test file for double deletion." << std::endl;
    file.close();

    int firstDeleteResult = DELETE("testfile200.txt");
    EXPECT_EQ(firstDeleteResult, true);

    int secondDeleteResult = DELETE("testfile200.txt");
    EXPECT_EQ(secondDeleteResult, false);
}