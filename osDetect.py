import platform
import os
import subprocess

print("System:", platform.system())   # Windows, Linux, or Darwin (macOS)
print("Node:", platform.node())       # Hostname
print("Release:", platform.release()) # OS version
print("Version:", platform.version()) # Detailed version
print("Architecture:", platform.architecture()) # 32-bit or 64-bit

# Detect OS
system_name = platform.system().lower()

print(f"Detected OS: {system_name}")

# Run the respective script
if "windows" in system_name:
    print("Running Windows C++ installer...")
    subprocess.run(["python", "install_windows.py"], check=True)
elif "linux" in system_name:
    print("Running Linux C++ installer...")
    subprocess.run(["bash", "install_linux.sh"], check=True)
elif "darwin" in system_name:
    print("Running macOS C++ installer...")
    subprocess.run(["bash", "install_macos.sh"], check=True)
else:
    print("Unsupported OS")