#include "project.h"
#include <fstream>
#include <sstream>
#include <stdexcept>
#include <cstdlib>
#include <iostream>
#include <string>

/*
 * get function implementation.
 * reads a file, decompresses it, prints it, and returns the decompressed string.
 */
bool DELETE(const std::string &fileName)
{
    std::lock_guard<std::mutex> lock(project_mutex);
    // Read the base directory from environment variable.
    const char *env = std::getenv("FILES_DIR");
    std::string baseDir = env ? std::string(env) : "./files";

    // Build the full path to the file.
    std::string fullPath = std::string(baseDir) + "/" + fileName;

    // Attempt to delete the file.
    if (std::remove(fullPath.c_str()) != 0)
    {
        // Deletion failed
        return false;
    }


    // Return 
    return true;
}