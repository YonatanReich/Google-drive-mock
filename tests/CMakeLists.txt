# CMAKE FOR TESTS
cmake_minimum_required(VERSION 3.10)
project(theProject)

set(CMAKE_CXX_STANDARD 17)

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)

set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

add_executable(runTests
    # source files (Updated Paths)
    ../src/Operations/get.cpp
    ../src/Operations/add.cpp
    ../src/Operations/search.cpp
    ../src/Operations/DELETE.cpp
    ../src/Compression_logic/RLE.cpp
    ../src/Commands/AddCommand.cpp
    ../src/Commands/GetCommand.cpp
    ../src/Commands/SearchCommand.cpp
    ../src/Commands/DeleteCommand.cpp
    ../src/project/project.cpp

    # test files (Keep as is)
    add_tests.cpp
    search_tests.cpp
    get_tests.cpp
    Delete_tests.cpp
    server_tests.cpp
    main.cpp
)

# Update include directories for tests too
target_include_directories(runTests PRIVATE 
    ${CMAKE_SOURCE_DIR}/src/project
    ${CMAKE_SOURCE_DIR}/src/Compression_logic
    ${CMAKE_SOURCE_DIR}/src/Operations
    ${CMAKE_SOURCE_DIR}/src/Commands
)
target_link_libraries(runTests gtest_main)