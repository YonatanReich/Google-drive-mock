#include "DeleteCommand.h"
#include "project.h"

/*
 * return the command name (helps the main code match user input).
 */
std::string DeleteCommand::getName() const {
    return "DELETE";
}

std::string DeleteCommand::execute(const std::string &input, std::istringstream &iss) {

    const std::string CMD = "DELETE";
    size_t index = CMD.size(); // 6
    size_t spaces = 0;

    while (index < input.size() && input[index] == ' ')
    {
        spaces++;
        index++;
    }

    if (spaces != 1)
        return "400 Bad Request\n";

    // read file name
    std::string filename;
    iss >> filename;

    // if no file name, return
    if (filename.empty()) {
        return "400 Bad Request\n";
    }

    if(DELETE(filename)){
        return "204 No Content\n";
    }else{
        return "404 Not Found\n";
    }
}