import platform
import os

print("System:", platform.system())   # Windows, Linux, or Darwin (macOS)
print("Node:", platform.node())       # Hostname
print("Release:", platform.release()) # OS version
print("Version:", platform.version()) # Detailed version
print("Architecture:", platform.architecture()) # 32-bit or 64-bit
