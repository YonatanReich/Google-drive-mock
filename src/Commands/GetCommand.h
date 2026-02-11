#ifndef GETCOMMAND_H
#define GETCOMMAND_H

#include "Command.h"


/*
 * GetCommand class handles the "get" command functionality.
 * extends the base Command class.
 */
class GetCommand : public Command {
public:
    std::string getName() const override;
    std::string execute(const std::string &input, std::istringstream &iss) override;
};

#endif