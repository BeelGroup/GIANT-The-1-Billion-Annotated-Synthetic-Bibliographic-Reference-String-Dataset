#!/bin/bash

for folder in ./outputFiles/*; do
  for filename in $folder/*; do
    python 1BcsvAnalysis.py $filename
    echo $filename
  done
done
