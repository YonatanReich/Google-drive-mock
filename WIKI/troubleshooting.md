# 🛠 Troubleshooting

If you encounter issues while setting up or running the G-Drive Clone, check the common solutions below.

---

## 🌐 Network & Connection Issues

### 1. The Mobile App shows "localhost" instead of an IP
**Symptoms:** The QR code appears, but the logs say `🔗 API URL: http://localhost:3000` and the phone cannot connect.
* **Cause:** The Docker container failed to receive the `HOST_IP` environment variable or the `generate-config.js` script used a fallback.
* **Fix:** Ensure you are using the **PowerShell One-Liner** from the [Getting Started](./getting-started.md) guide. Do not just run `docker-compose up`.

### 2. Physical Phone cannot connect to the server
**Symptoms:** The IP is correct (e.g., `192.168.1.50`), but the phone says "Network Request Failed."
* **Check Wi-Fi:** Ensure your phone and PC are on the **exact same Wi-Fi network**.
* **Firewall:** Windows Firewall sometimes blocks Port 3000. Try temporarily disabling it or adding an Inbound Rule for Port 3000.
* **Is the Server Running?** Open your browser on the PC and go to `http://localhost:3000`. If it doesn't load, the issue is the backend, not the network.

### 3. Android Emulator cannot reach the API
**Symptoms:** The app works on a physical phone but not the emulator.
* **Cause:** The emulator treats `localhost` as its own internal loopback.
* **Fix:** The app is hardcoded to use `10.0.2.2` for Android Emulators. Ensure your `generate-config.js` logic hasn't been modified to remove the `Platform.isDevice` check.

---

## 🐳 Docker & Build Errors

### 1. Node.js Version Conflicts
**Symptoms:** `The engine "node" is incompatible with this module.`
* **Cause:** The `package.json` specifies a version (like Node 20) that doesn't match the Docker image.
* **Fix:** We have updated the `Dockerfile` to use `node:20-alpine`. If you still see this, run:
    ```bash
    docker-compose down
    docker-compose build --no-cache mobile-app
    ```

### 2. MongoDB Connection Refused
**Symptoms:** `mvc-server` logs show `MongooseServerSelectionError`.
* **Fix:** Ensure the `mongo` service is healthy. Check logs with:
    ```bash
    docker-compose logs mongo
    ```

---

## 📱 Expo & React Native

### 1. QR Code not appearing
* **Fix:** Check the `mobile-app` container logs. If it’s stuck on "Starting Metro," it might be downloading dependencies. Give it a few minutes.

### 2. "Something went wrong" in Expo Go
* **Fix:** Clear the Expo Go app cache on your phone and restart the Docker container. Sometimes the "Bundle" gets cached incorrectly.

---

Docker Compose will automatically use this value, bypassing the need for the long PowerShell command.
