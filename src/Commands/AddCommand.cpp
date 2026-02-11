#include "AddCommand.h"
#include "project.h"

// return command name
std::string AddCommand::getName() const {
    return "POST";
}

// run add command
std::string AddCommand::execute(const std::string &input, std::istringstream &iss) {

    // check for exactly one space after "POST"
    size_t index = 4; 
    size_t spaces = 0;
    // count spaces after command name 
    while (index < input.size() && input[index] == ' ') {
        spaces++;
        index++;
    }
    // If more than one space between command and filename, ditch the command
    if (spaces != 1) {
        return "400 Bad Request\n";
    }

    // read file name
    std::string filename;
    // File name cannot contain spaces so we can use >> operator
    iss >> filename;
    if (filename.empty()) {
        return "400 Bad Request\n";
    }

    // read the text (may include spaces so we must use getline)
    std::string text;
    std::getline(iss, text);

    // remove leading space from text if exists
    if (!text.empty() && text[0] == ' ') {
        text.erase(0, 1);
    }

    // call real add()
    bool success = add(filename, text);
    if (!success)
        return "400 Bad Request\n";
    return "201 Created\n";
}

