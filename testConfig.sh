
if [ -f .env.local ]; then
    # Load Environment Variables
    export $(cat .env.local | grep -v '#' | awk '/=/ {print $1}')
    
    search="REACT_APP_CONTRACT_PROFILE"
    replace=$REACT_APP_CONTRACT_PROFILE
    #echo $REACT_APP_ACCESS_NODE
    #echo $REACT_APP_WALLET_DISCOVERY
    #echo $REACT_APP_CONTRACT_PROFILE
    echo $search
    echo $replace

    echo "Importing Script Address"
    for filename in ./src/cadence/scripts/*.cdc; do
        echo $filename
        sed -i '' -e "s/${search}/${replace}/" $filename
    done

    echo "Importing Transaction Address"
    for filename in ./src/cadence/transactions/*.cdc; do
        echo $filename
        sed -i '' -e "s/${search}/${replace}/" $filename
    done
    
    echo "Importing Contract Address"
    for filename in ./src/cadence/contracts/*.cdc; do
        echo $filename
        sed -i '' -e "s/${search}/${replace}/" $filename
    done
fi