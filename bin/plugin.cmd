@echo off
setlocal
set HERE=%~dp0
call "%HERE%narwhal.cmd" -p "../../../_source/" -m "ckrpm/plugin" plugin %*
