# Google Drive Mock project:

How to run the react app:
-Open your favorite terminal and run the following command: docker-compose up --build server mvc-server mongo 

//INTEGRATE DOCKER LATER, FOR NOW:///
If running on a mobile phone, in mobile_app/config.js change PHYSICAL_PHONE_IP to your computer's IP (where you run docker)
type: npx expo start in your terminal and scan the QR on your phone


note: you dont have to restart docker ever, unless you make changes in the mvc_web_server files
also notice: mongo saves all information, even after restarting docker, so dont try to use the same username over and over again (delete the volume in docker if you want to start fresh)
////////////////////////////////////

1. Authentication (Login/Signup)
Accessing the App: Users must create an account or log in via the landing page.

Security: Your session is secured with JWT (JSON Web Tokens). Logging out clears all local state, ensuring your files remain private on shared machines.

🏠 2. My Files (Main page)
Organization: Create folders to nest your documents. You can navigate through the directory structure using the directory path at the top.

File Actions: 
-Clicking on a file fetches the full text content from the server and opens the built-in editor.
-Rename a folder by clicking on the pencil icon next to its name.

Uploading: Use the "Upload" button to move local files from your computer into the storage.

👥 3. Shared with Me
Collaboration: Files shared with you by other users appear here.

Permissions: 
-Owner: Guarenteed only for the creator of the file.
-Editor: You can modify the content and save changes back to the owner's storage.
-Viewer: Have "Read-Only" access. 

Live Updates: The app checks the source array to ensure you are always seeing the version you have permission to access.

🕒 4. Recent Files
Smart Tracking: This page automatically aggregates files you’ve recently created or updated.

Sorting: Files are sorted by the time they were last accessed, putting your most relevant work at the top.

⭐ 5. Starred
Quick Access: Toggle the "Star" icon on any file to add it to this high-priority list. This is a global state that works across both owned and shared documents.

🗑️ 6. Trash
Safety Net: Deleted files are moved here first.

Management: You can Restore a file to its original location or Permanently Delete it to wipe it from the storage server.

⚙️ 7. Settings
Customization: Switch between Light Mode and Dark Mode and Grid View and List View.

Account Info: View your profile details and manage your preferences.

Profile picture: Upload or change your profile picture by clicking on the image on the top right of the screen.



Tests:

This program also includes test files to test the program. To run tests type the command: docker compose run asp-tests

-"add" tests: These tests make sure the command created the files correctly, with compressed content, that it is able to create multiple files in a row, and doesnt create files with illegal names.

-"get" tests: These tests make sure the command prints the content correctly, with decompressed content, that it prints content that include spaces, and that it doesnt return content for files which do not exist.

-"search" tests: These tests make sure the command prints the correct file names which include the desired content, that it is capble of looking for content that contains spaces, and returning multiple files for one command.

-"delete" tests: These tests make sure the command deletes the correct file , that it does not run the command for incorrect or empty inputs, and that it does not delete a file twice.

-"Server" tests: These tests make sure that the server handles socket creation properly and multithreading properly - no crashing, no deadlocks.




