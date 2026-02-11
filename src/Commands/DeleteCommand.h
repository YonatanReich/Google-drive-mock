#ifndef DELETECOMMAND_H
#define DELETECOMMAND_H
#include "Command.h"


/*
 * DeleteCommand class handles the "delete" command functionality.
 * extends the base Command class.
 */
class DeleteCommand : public Command {
public:
    std::string getName() const override;
    std::string execute(const std::string &input, std::istringstream &iss) override;
};

#endif