## Install Node Version Manager (NVM)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

## Activate NVM
. ~/.nvm/nvm.sh

## Install latest node version
nvm install node

## Install specific version of node (14 is long term stable)
nvm install 14

## Make default alias
nvm alias default 14

## Check node version
node -e "console.log('Running Node.js ' + process.version)"

