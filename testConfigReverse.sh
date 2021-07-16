
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

    echo "Reversing Script Imports"
    for filename in ./src/cadence/scripts/*.cdc; do
        echo $filename
        sed -i '' -e "s/${replace}/${search}/" $filename
    done

    echo "Reversing Transaction Imports"
    for filename in ./src/cadence/transactions/*.cdc; do
        echo $filename
        sed -i '' -e "s/${replace}/${search}/" $filename
    done
    
    echo "Reversing Contract Imports"
    for filename in ./src/cadence/contracts/*.cdc; do
        echo $filename
        sed -i '' -e "s/${replace}/${search}/" $filename
    done
fi