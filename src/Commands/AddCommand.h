#ifndef ADDCOMMAND_H
#define ADDCOMMAND_H
#include "Command.h"

// AddCommand class derived from Command
class AddCommand : public Command {
public:
    std::string getName() const override;
    std::string execute(const std::string &input, std::istringstream &iss) override;
};

#endif