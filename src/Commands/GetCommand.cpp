#include "GetCommand.h"
#include "project.h"

/*
 * return the command name (helps the main code match user input).
 */
std::string GetCommand::getName() const
{
    return "GET";
}

/*
 * run the get command.
 * checks for proper input and calls the real get() function.
 */
std::string GetCommand::execute(const std::string &input, std::istringstream &iss)
{

    // check if theres more chars after command name
    if (input.length() < 5)
    {
        return "400 Bad Request\n";
    }

    // check for more than one space after command name
    if (input[4] == ' ')
    {
        return "400 Bad Request\n";
    }

    // continue to read the file name
    // read file name
    std::string filename;
    iss >> filename;

    // if no file name, return
    if (filename.empty())
    {
        return "400 Bad Request\n";
    }

    // call the get function, if exists return 200 OK with content, else 404 Not Found
    
        std::string result = get(filename);
        if(result == "404 Not Found\n"){
            return result;
        }
        return "200 Ok\n\n" + result + "\n";
}