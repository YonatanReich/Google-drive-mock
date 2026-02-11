#include <gtest/gtest.h>
#include "project.h"
#include <fstream>

TEST(GetTests, PositiveTest)
{
    // correct decompression
    EXPECT_EQ(get("test1.txt"), "AABBBC");
}

TEST(GetTests, NegativeTest)
{
    // incorrect text
    EXPECT_NE(get("test1.txt"), "Shalom!");
}

TEST(GetTests, NegativeTest2)
{
    // missing last letter
    EXPECT_NE(get("test1.txt"), "AABBB");
}

TEST(GetTests, PositiveTest2)
{
    // correct decompression
    EXPECT_EQ(get("test2.txt"), "AA");
}

TEST(GetTests, NegativeTest3)
{
    // incorrect text
    EXPECT_NE(get("test2.txt"), "Shalom!");
}

TEST(GetTests, PositiveTestWithSpaces)
{
    // correct decompression with spaces
    EXPECT_EQ(get("test4.txt"), "AA      BBC");
}

TEST(GetTests, FileExistsTest)
{
    // returning empty string (without printing) if file doesn't exist
    EXPECT_EQ(get("missing.txt"), "404 Not Found\n");
}
