#!/bin/bash
ipconfig |grep -i "IPv4 Address" | cut -d: -f2;

python3 -m http.server;
