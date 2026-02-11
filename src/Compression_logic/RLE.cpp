#include <iostream>
#include <string>
#include <sstream>
#include <filesystem>
#include <fstream> 
#include "project.h"

std::string RLECompress(std::string toCompress){
    if(toCompress.empty()) return "";

    char currentChar = '\0';
    int count = 0;
    std::string compressed="";

    //loop through each char in the string
    for(char c : toCompress){
        //For first iteration only, set the first char.
        if(count==0 && currentChar=='\0'){
            currentChar=c;
        }
        //If theres another char of same type in a row, increment the count
        if(currentChar==c){
            count++;
        }
        //If the set of chars is disrupted,edit the compressed string, zero the count and start a new set.
        if(currentChar!=c && count!=0){
            //edit the compressed string.
            compressed += std::to_string(count);
            //if the current char is a digit, we want to mark it as a char and not a count, so added an escape character
            compressed += '\\';   
            compressed += currentChar;
            //change the current char and start the count again.
            currentChar = c;
            count = 1;
        }
    }
    //add the last set
    compressed += std::to_string(count);
    compressed += '\\';
    compressed += currentChar;
    //std::cout << compressed << std::endl; //keeping this for tests
    return compressed;
}

std::string RLEDecompress(std::string toDecompress){

    if(toDecompress.empty()) return "";
    std::string decompressed;
    std::string numStr;

    for(size_t i = 0; i < toDecompress.size(); i++) {
        char c = toDecompress[i];
         if (std::isdigit(c)) {
            numStr += c; //add digits to the string, this makes sure number that are more than one digit will not be cut in the middle
        } else {

            char cToUse = c;
            if (c == '\\') {
                //move to the actual character we need to decompress
                i++;  
                if (i < toDecompress.size()) {
                    cToUse = toDecompress[i];
                }
            }

            // now c is the character
            int count = std::stoi(numStr);
            decompressed.append(count, cToUse);
            numStr.clear();
        }
    }
    //std::cout << decompressed << std::endl; //keeping this for tests
    return decompressed;
}
