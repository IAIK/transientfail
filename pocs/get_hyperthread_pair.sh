#!/bin/zsh

setopt extendedglob

cd /sys/devices/system/cpu/

for i in cpu[0-9]##; do
  package=`cat $i/topology/physical_package_id`
  core=`cat $i/topology/core_id`

  cpu_id="${i#cpu}"
  
  config="$package-$core"
  if (( ${+target_config} )); then
    if [[ $target_config == $config ]]; then
      echo "$first_cpu_id $cpu_id"
      break
    fi
  else
    target_config="$config"
    first_cpu_id="$cpu_id"
  fi
done
