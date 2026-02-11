#include "SearchCommand.h"
#include "project.h"

std::string SearchCommand::getName() const
{
    return "SEARCH";
}

std::string SearchCommand::execute(const std::string &input, std::istringstream &iss)
{

    // read the rest of the line as search query
    std::string query;
    std::getline(iss, query);
    // remove first space
    if (!query.empty() && query[0] == ' ')
    {
        query.erase(0, 1);
    }
    return search(query);
}