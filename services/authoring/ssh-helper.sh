#!/bin/sh
ssh -o StrictHostKeyChecking=no -i $GIT_CLI_SSH_PRIVATE_KEY "$@"