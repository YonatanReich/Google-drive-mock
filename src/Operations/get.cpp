#include "project.h"
#include <fstream>
#include <sstream>
#include <stdexcept>
#include <cstdlib>
#include <iostream>
#include <string>
#include <stdexcept>

/*
 * get function implementation.
 * reads a file, decompresses it, prints it, and returns the decompressed string.
 */
std::string get(const std::string &fileName)
{
    std::lock_guard<std::mutex> lock(project_mutex);
    // Read the base directory from environment variable.
    const char *env = std::getenv("FILES_DIR");
    std::string baseDir = env ? std::string(env) : "./files";

    // Build the full path to the file.
    std::string fullPath = std::string(baseDir) + "/" + fileName;

    // Open the file. If it fails, return empty string without printing.
    // If the file does not exist, throw an exception - to be handled by caller.
    std::ifstream file(fullPath);
    if (!file.is_open())
    {
        return "404 Not Found\n";
    }

    // Read the entire file content (compressed text).
    std::ostringstream buffer;
    buffer << file.rdbuf();
    std::string compressed = buffer.str();

    // Decompress the content using RLEDecompress function.
    std::string decompressed = RLEDecompress(compressed);

    // Return the decompressed string.
    return decompressed;
}