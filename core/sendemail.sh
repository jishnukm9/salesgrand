#!/bin/bash


gv_emailids=$1
gv_content=$2 
gv_subject=$3

echo ${gv_content} | mail -s ${gv_subject} ${gv_emailids}
