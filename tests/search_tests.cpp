#include <gtest/gtest.h>
#include "project.h"
#include <vector>
#include <string>

TEST(SearchTests, NoMatchingFilesReturnsEmptyList)
{
    // Expect no filenames returned when no file contains the query
    std::string expected = "404 Not Found\n";
    EXPECT_EQ(search("XYZ"), expected);
}

TEST(SearchTests, SingleMatchingFileReturnedByName)
{
    // EXPECTED RESULT: vector containing ONLY the filename
    std::string expected = {"200 Ok\n\ntest1.txt test4.txt \n"};
    EXPECT_EQ(search("BC"), expected);
}

TEST(SearchTests, EmptyQueryReturnsAllFilenames)
{
    // Searching for "A" must return ALL file names in directory
    std::string expected = "200 Ok\n\ntest1.txt test2.txt test3.txt test4.txt \n";
    EXPECT_EQ(search("A"), expected);
}

TEST(SearchTests, SearchingForContentWithSpaces)
{
    // Searching for "A" must return ALL file names in directory
    std::string expected = {"200 Ok\n\ntest4.txt \n"};
    EXPECT_EQ(search("AA   "), expected);
}
