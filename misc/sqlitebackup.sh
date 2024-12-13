#!/bin/bash


logMsg(){

    v_time=$(date)
    v_message=$1
    v_logfile=${gv_logfile}
    echo "${v_time} ${v_message}" | tee -a ${v_logfile}
}

validateSpace(){
    
    local v_destination=$1
    local v_datafilelocation=$2
    local v_availablespace
    local v_datafilesize
    local v_freespace

    logMsg "Validating space and data file"
    
    logMsg "v_destination: ${v_destination}"

    v_availablespace=$(df -k / | grep -v ^File |awk '{print $4}')
    logMsg "v_availablespace: ${v_availablespace}"

    if [[ -f ${v_datafilelocation} ]]; then 
        v_datafilesize=$(du -sk ${v_datafilelocation}|awk '{print $1}')
        logMsg "v_datafilesize: ${v_datafilesize}"
    else 
        logMsg "Missing data file: ${v_datafilelocation}"
	sendMail "Missing data file" ${gv_email}
        exit 0
    fi

    v_freespace=$((${v_availablespace}-${v_datafilesize}))
    logMsg "v_freespace: ${v_freespace}"

    if [[ ${v_freespace} -lt 1024 ]];then
        logMsg "Not enough space available in ${v_datafilelocation}"
	sendMail "Not enough space available on the server!" ${gv_email}
        exit 0 
    fi 

}


takeBackup(){

    local v_datafile=$1
    local v_date=$(date +%d-%m-%Y-%H-%M-%S-%Z)
    local v_justdate=$(date)
    local v_exitstatus
    
    logMsg "Initiating datafile backup"
    sqlite3 ${v_datafile} ".backup ${gv_destination}/db.sqlite3_${v_date}.backup"
    v_exitstatus=$?

    if [[ $? -eq 0 ]]; then 
        logMsg "Backup has been taken successfully"
        logMsg "Backup file : ${gv_destination}/db.sqlite3_${v_date}.backup"
	sendMail "Backup completed - ${v_justdate}: BackupFile:${gv_destination}/db.sqlite3_${v_date}.backup" ${gv_email}
    else 
        logMsg "Backup failed with error: ${v_exitstatus}"
        sendMail "Backup failed with error ${v_exitstatus}" ${gv_email}
        exit 0
    fi
}


sendMail(){
    local v_message=$1
    local v_emailid=$2
    local v_subject="MAGNUS-BACKUP-STATUS"

    echo ${v_message} | mail -s ${v_subject} ${v_emailid}
    if [[ $? -eq 0 ]]; then 
        logMsg "Email sent successfully"
    else 
        logMsg "Email failed to sent"
    fi 
}    


# MAIN

declare gv_logfile="sqlitebackup.log"
declare gv_destination="/MAGNUS_BACKUP"
declare gv_datafile="/MAGNUS/sensefrog/db.sqlite3"
declare gv_email="jishnu@senseweave.com,ranjith@senseweave.com"

validateSpace ${gv_destination} ${gv_datafile}
takeBackup ${gv_datafile}

