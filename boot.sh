#!/bin/bash

# 获取当前脚本所在目录
script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# 创建 Cron 作业字符串
cron_job="0 0 * * * cd $script_dir && node index.js"

# 将 Cron 作业添加到用户的 Crontab 中
(crontab -l 2>/dev/null; echo "$cron_job") | crontab -