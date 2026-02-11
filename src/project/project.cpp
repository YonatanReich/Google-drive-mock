#include <iostream>
#include <string>
#include <sstream>
#include <cctype>
#include "project.h"
#include "Command.h"
#include "AddCommand.h"
#include "SearchCommand.h"
#include "GetCommand.h"
#include "DeleteCommand.h"

// Create command objects ONCE
static AddCommand addCmd;
static SearchCommand searchCmd;
static GetCommand getCmd;
static DeleteCommand deleteCmd;

// command array
static Command *commands[] = {
    &addCmd, &searchCmd, &getCmd, &deleteCmd};
std::mutex project_mutex;

std::string handleRequest(const std::string &server_request)
{
    const std::string bad_request = "400 Bad Request\n";
    // Reject empty or whitespace-leading requests
    if (server_request.empty())
        return bad_request;
    if (std::isspace(static_cast<unsigned char>(server_request[0])))
        return bad_request;

    // Extract command name
    std::istringstream iss(server_request);
    std::string name;
    iss >> name;

    if (name.empty())
        return bad_request;

    // Case-insensitive command matching:
    for (char &c : name)
        c = std::toupper(c);

    // Find and execute matching command
    for (Command *cmd : commands)
    {
        if (cmd->getName() == name)
        {
            return cmd->execute(server_request, iss);
        }
    }
    // Unknown command
    return bad_request;
}
