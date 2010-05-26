@echo off
setlocal
set HERE=%~dp0
call "%HERE%narwhal.cmd" -p "../../../_source/" -m "ckgems/plugin" plugin %*
