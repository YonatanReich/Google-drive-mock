#include <iostream>
#include <string>
#include <sstream>
#include <filesystem>
#include <fstream>
#include "project.h"
#include <vector>
#include <algorithm>

// checks if file contains the given content
bool fileContains(const std::filesystem::path &path, const std::string &needle)
{
    std::ifstream file(path.string());
    if (!file.is_open())
        return false;

    std::string line;
    // get each line from the file
    while (std::getline(file, line))
    {
        std::string processed = line;

        // If compressed, decompress
        if (processed.find('\\') != std::string::npos)
        {
            try
            {
                processed = RLEDecompress(processed);
            }
            catch (...)
            {
                continue;
            }
        }

        // check for match
        if (processed.find(needle) != std::string::npos)
        {
            return true;
        }
    }

    return false;
}

// Main search function for searching which files contain file content.
std::string search(const std::string &fileContent)
{
    std::vector<std::string> matches;

    // if no content was entered return no file
    if (fileContent == "")
        return "400 Bad Request\n";

    // get the base directory
    const char *env = std::getenv("FILES_DIR");
    std::string baseDir = env ? std::string(env) : "./files";

    for (const auto &myFile : std::filesystem::directory_iterator(baseDir))
    {
        if (!myFile.is_regular_file())
            continue;

        // get file name
        std::string filename = myFile.path().filename().string();

        bool nameMatches = (filename.find(fileContent) != std::string::npos);
        

        // Check file contents
        bool contentMatches = fileContains(myFile.path(), fileContent);

        // put all file names in a vector
        if (contentMatches || nameMatches)
        {
            matches.push_back(myFile.path().filename().string());
        }
    }
    std::sort(matches.begin(), matches.end());
    if (matches.empty()){
        return "404 Not Found\n";
    }
    std::string result = sendFileNames(matches);
    return "200 Ok\n\n" + result;
}

// add file names from the vector into a string
std::string sendFileNames(std::vector<std::string> matches)
{
    std::lock_guard<std::mutex> lock(project_mutex);
    std::string result;
    for (size_t i = 0; i < matches.size(); i++)
    {
        if (i < matches.size())
        {
            result += matches[i];
            result += " ";
        }
    }
    if (matches.size() != 0)
        result += "\n";
    return result;
}
