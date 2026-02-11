#ifndef COMMAND_H
#define COMMAND_H

#include <string>
#include <sstream>

// base class for any command
class Command {
public:
    virtual ~Command() = default;

    // name of the command (like "add", "get", "search")
    virtual std::string getName() const = 0;

    // run the command's logic
    virtual std::string execute(const std::string &input, std::istringstream &iss) = 0;
};

#endif