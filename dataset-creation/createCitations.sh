#!/bin/bash

# for each file in inputFiles, generate citation csv, zip csv, remove csv file
# output files are saved as zip to outputFiles directory

for filename in ./inputFiles/*; do
  cd ~/dataset-creation/
  file="${filename##*/}"
  node generateCSVcitationdataset.js tags ${file}

  cd outputFiles
  outputFile="${file/.json/""}.csv"
  zip "${outputFile/.csv/.zip}" "output_${outputFile}"

  rm "output_${outputFile}"
done
