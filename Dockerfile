FROM gcc:latest

RUN apt-get update && apt-get install -y cmake python3 && rm -rf /var/lib/apt/lists/*

COPY . /usr/src/project
WORKDIR /usr/src/project


ENV MAIN_DIR="."
ENV SOURCE_DIR="./src"
ENV TESTS_DIR="./tests"
ENV FILES_DIR="./files"


RUN mkdir build
WORKDIR /usr/src/project/build
RUN cmake .. && make -j4

WORKDIR /usr/src/project


CMD ["./build/server", "5555"]