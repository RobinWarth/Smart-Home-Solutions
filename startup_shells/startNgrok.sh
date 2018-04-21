#!/bin/bash
clear

cd ../
./ngrok http -subdomain=yoursubdomainifexist -region=eu -auth="user:pw" 3000