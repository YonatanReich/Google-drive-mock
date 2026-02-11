# 🏁 Getting Started

This guide will help you get the G-Drive Clone ecosystem up and running on your local machine.

## 📋 Prerequisites
* **Docker & Docker Compose** (Installed and running)
* **Mobile Testing:** [Expo Go](https://expo.dev/go) installed on your physical device **OR** Android Studio (for Emulator).
* **Network:** Your computer and mobile device must be on the **same Wi-Fi network**.

---

## 🚀 Running the Project

1. **Download:** Clone or download the repository and navigate to the project root.
2. **Terminal:** Open your terminal inside the main folder.
3. **Execution:** Use the command appropriate for your Operating System.

### Option A: Automatic IP Detection (Recommended)
This command automatically finds your Wi-Fi IP and shares it with the Docker containers so your phone can connect.

#### 🪟 Windows (PowerShell)
```powershell
$env:HOST_IP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -match 'WiFi|Wi-Fi|Ethernet' -and $_.InterfaceAlias -notmatch 'Bluetooth|vEthernet|Loopback|Docker' } | Select-Object -First 1).IPAddress; docker-compose run --build server mvc-server mongo mobile-app
```
#### 🍎 Mac / 🐧 Linux
```bash
HOST_IP=$(ipconfig getifaddr en0 || hostname -I | awk '{print $1}') docker-compose run --build  server mvc-server mongo mobile-app
```

In the event these commands dont recognize the IP corretly, manually check your IP by running IPCONFIG in a terminal and then run this command:

### For mac/linux:
```bash
$env:HOST_IP="192.168.x.x"; docker-compose run --build server mvc-server mongo mobile-app
```
### For windows/Powershell:

```powershell
$env:HOST_IP="192.168.x.x"; docker-compose run --build server mvc-server mongo mobile-app
```
Now scan the QR code that appeared. If using an emulator, type the exp: address from the terminal into chrome. (example: exp://192.168.1.50:8081)

## Networking (Physical Phone vs Emulator)
- **Physical Phone:** Ensure you are on the same Wi-Fi.
- **Android Emulator:** Uses \`10.0.2.2\` to talk to the Node server.
