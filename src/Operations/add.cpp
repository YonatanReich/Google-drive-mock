#include <fstream>
#include <iostream>
#include <string>
#include "project.h"
#include <filesystem>

std::string BASE_PATH = std::getenv("FILES_DIR");
//checks if the file exists
bool fileExistsInDir(const std::string &directory, const std::string &fileName)
{   //set full path
    std::string fullPath = directory + "/" + fileName;

    // try to open the file
    std::ifstream f(fullPath);
    
    // return true if the file opened successfully
    return f.good();
}



//Real add implementation
bool add(const std::string &fileName, const std::string &text){
    std::lock_guard<std::mutex> lock(project_mutex);
   //check if file already exists, if so, do nothing
    if (fileExistsInDir(BASE_PATH, fileName))
    {
        return false;
    }
    //compress the text using RLE before storing
    std::string compressed = RLECompress(text);

    //set the full path to the file
    std::string fullPath = BASE_PATH +"/"+ fileName;
    std::ofstream out(fullPath);

    //if file cannot be opened for any reason, return
    if (!out.is_open())
    {
        return false;
    }
    //write the compressed text to the file
    out << compressed;
    return true;
}
