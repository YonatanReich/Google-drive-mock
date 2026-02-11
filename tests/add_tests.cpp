#include <gtest/gtest.h>
#include "project.h"
#include <fstream>
#include <cstdio>
#include <filesystem>

// Add Command Tests 

TEST(AddTests, CreatesNewFileCorrectly) { 
    //Creates the file using add
    std::string content ="AABBBC" ;
    std::string fileName ="test1.txt" ;
    add(fileName, content);
    
    const char* env = std::getenv("FILES_DIR");
    std::string basePath = env ? std::string(env) : "./files";

    std::filesystem::path filePath = std::filesystem::absolute(basePath) / fileName;
    std::ifstream file(filePath);
    ASSERT_TRUE(file.is_open());    
    

    //checks if the file created correctly
    std::string contentFromFile;
    content = RLECompress(content);
    std::getline(file, contentFromFile);
    EXPECT_EQ(content, contentFromFile);
}

TEST(AddTests, FailsToOverwrite) {
    //checks that an additional add doesnt overwrite exisiting code
    add("test1.txt", "AAA");   
    std::string contentCompressed;
    std::ifstream file("test1.txt");
    std::getline(file, contentCompressed);
    EXPECT_NE(contentCompressed,"AAA");
}

TEST(AddTests, CreatesMultipleFilesSequentially) { 
    add("test2.txt", "AA");
    add("test3.txt", "AAABB");
    add("test4.txt","AA      BBC"); //contect which includes spaces
    EXPECT_TRUE(std::filesystem::exists("./files/test2.txt")); 
    EXPECT_TRUE(std::filesystem::exists("./files/test3.txt"));
    EXPECT_TRUE(std::filesystem::exists("./files/test4.txt"));
}

TEST(AddTests, RejectsInvalidFileName_Space) {
    add("bad name.txt", "");
    EXPECT_FALSE(std::filesystem::exists("bad name.txttest3.txt"));
}

