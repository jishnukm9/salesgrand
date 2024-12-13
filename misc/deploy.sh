#!/bin/bash


declare backupTime=$(date +%M-%S-%d-%m-%Y)
declare -i appPid
declare jenkinsWorkDir="/JENKINS/workspace/sensefrog-deploy"

appPid=$(ps -ef | grep -i 8000 | grep -v grep | head -1 | awk '{print $2}')

if [[ -n ${appPid} ]]; then 
    echo "Killing ${appPid}"
    if [[ $? -eq 0 ]]; then 
        echo "${appPid} has been killed successfully"
    else 
        echo "Failed to kill ${appPid}"
        exit 1 
    fi 
else 
    echo "Unable to determine the process id of the app!"
    exit 1 
fi 

echo "Backing up the existing directory"
zip -r /MAGNUS/sensefrog_${backupTime}.zip  /MAGNUS/sensefrog 
if [[ $? -eq 0 ]]; then 
    echo "Backup completed successfully"
    echo "Removing the directory now"
    rm -rf /MAGNUS/sensefrog 
else  
    echo "Backup failed to complete!"
    exit 1 
fi 


echo "Copying new files now"
mkdir -p /MAGNUS/sensefrog
chmod 775 /MAGNUS/sensefrog
if [[ -d ${jenkinsWorkDir} ]]; then 
    cp -r ${jenkinsWorkDir}/* /MAGNUS/sensefrog
    if [[ $? -eq 0 ]]; then 
        echo "Copying successfully completed"
    else 
        echo "Copying failed!"
        exit 1 
    fi 
else 
    echo "Jenkins Directory ${jenkinsWorkDir} doesn't exists!"
    exit 1
fi 



echo "Starting server"
nohup /usr/bin/python3 /MAGNUS/sensefrog/manage.py runserver --insecure 0.0.0.0:8000 &
if [[ $? -eq 0 ]]; then 
    echo "Server started successfully"
else 
    echo "Failed to start the server!"
    exit 1
fi 



















 





