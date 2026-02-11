#ifndef SEARCHCOMMAND_H
#define SEARCHCOMMAND_H

#include "Command.h"

class SearchCommand : public Command {
public:
    std::string getName() const override;
    std::string execute(const std::string &input, std::istringstream &iss) override;
};

#endif