cmake_minimum_required(VERSION 3.10)
project(theProject)

set(CMAKE_CXX_STANDARD 17)

# Shared project sources used by BOTH server and client
set(PROJECT_SOURCES
    src/Operations/get.cpp
    src/Operations/add.cpp
    src/Operations/search.cpp
    src/Operations/DELETE.cpp
    src/Compression_logic/RLE.cpp
    src/Commands/AddCommand.cpp
    src/Commands/GetCommand.cpp
    src/Commands/SearchCommand.cpp
    src/Commands/DeleteCommand.cpp
    src/project/project.cpp
)

# -----------------------------
# Build SERVER executable
# -----------------------------
add_executable(server
    src/Server/server.cpp
    ${PROJECT_SOURCES}
)

find_package(Threads REQUIRED)
target_link_libraries(server PRIVATE Threads::Threads)

# -----------------------------
# Build CLIENT executable
# -----------------------------
add_executable(client
    src/Clients/client.cpp
    ${PROJECT_SOURCES}
)

# -----------------------------
# Includes
# -----------------------------
# Add all new subdirectories to the include path so direct includes (like #include "project.h") still work
target_include_directories(server PRIVATE 
    ${CMAKE_SOURCE_DIR}/src/project
    ${CMAKE_SOURCE_DIR}/src/Compression_logic
    ${CMAKE_SOURCE_DIR}/src/Operations
    ${CMAKE_SOURCE_DIR}/src/Commands
)

target_include_directories(client PRIVATE 
    ${CMAKE_SOURCE_DIR}/src/project
    ${CMAKE_SOURCE_DIR}/src/Compression_logic
    ${CMAKE_SOURCE_DIR}/src/Operations
    ${CMAKE_SOURCE_DIR}/src/Commands
)

add_subdirectory(tests)