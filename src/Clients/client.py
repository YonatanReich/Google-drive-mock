import socket
import sys

def main():
    # check that there is an ip and port
    if len(sys.argv) != 3:
        print("Usage: python3 client.py <ip> <port>")
        return

    # initialize the server details fromn arguments
    server_ip = sys.argv[1]
    server_port = int(sys.argv[2])

    # create socket (TCP)
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        # connect to the server
        sock.connect((server_ip, server_port))
    except:
        print("Error connecting to server")
        return

    # main loop
    while True:
        try:
            # get command from user
            line = input()

            # empty input -> ignore
            if not line:
                continue

            # add new line to string (requirement of task2)
            line += "\n"

            # send to server (bytes)
            sock.sendall(line.encode())

            # wait for response
            data = sock.recv(4096)

            # if no data, server closed connection
            if not data:
                break

            # print result
            print(data.decode(), end='')

        except EOFError:
            # stop if user exits from client (end of file)
            break
        except:
            break

    sock.close()

if __name__ == "__main__":
    main()