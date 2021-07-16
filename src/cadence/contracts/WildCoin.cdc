pub contract WildCoin {

    pub var totalSupply: UFix64
    pub var tokenName: String

    // This withdraw function, while public, is only callable by the account owner
    pub resource interface Provider {
        pub fun withdraw(amount: UFix64): @Vault {
            post {
                result.balance == UFix64(amount):
                    "Withdrawal amount must be the same as the balance of the withdrawn Vault"
            }
        }
    }

    // This deposit function is both public and executable by anyone
    // (which is secure since Vault references are controlled)
    pub resource interface Receiver {
        pub fun deposit(from: @Vault)
    }

    // Simple resource that keeps track of balance of this fungible token in an account
    pub resource interface Balance {
        pub var balance : UFix64
    }

    // The cornerstone: the Vault resource
    // A reference to this contract's Vault must be stored in an account's storage for the account to receive
    // this contract's type of fungible token
    pub resource Vault: Provider, Receiver, Balance {
        pub var balance: UFix64

        init(balance: UFix64) {
            self.balance = balance
        }

        // Defining the withdraw function as given access to by the Provider interface
        pub fun withdraw(amount: UFix64): @Vault {
            self.balance = self.balance - amount
            return <-create Vault(balance: amount)
        }

        // Defining the deposit function as given access to by the Receiver interface
        pub fun deposit(from: @Vault) {
            self.balance = self.balance + from.balance
            destroy from
        }
    }

    pub fun createEmptyVault(): @Vault {
        return <-create Vault(balance: 0.0)
    }

    // This resource is a function used for minting this contract's fungible tokens
    // Again, this resource is public but by default is only accessible by the contract account owner
    pub resource VaultMinter {
        pub fun mintTokens(amount: UFix64, recipient: Capability<&AnyResource{Receiver}>) {
            let recipientRef = recipient.borrow()
                ?? panic("Could not borrow a receiver reference to the vault.")
            
            WildCoin.totalSupply = WildCoin.totalSupply + UFix64(amount)
            recipientRef.deposit(from: <-create Vault(balance: amount))
        }
    }

    // For the sake of this example for testing, we are initializing the contract owner's account
    // with a supply of 30
    init() {
        self.totalSupply = 30.0
        self.tokenName = "WildCoin"

        let existing <-  self.account.load<@WildCoin.Vault>(from: /storage/MainVault)
        destroy existing
        let existingMinter <-  self.account.load<@WildCoin.VaultMinter>(from: /storage/MainMinter)
        destroy existingMinter

        let vault <- create Vault(balance: self.totalSupply)
        self.account.save(<-vault, to: /storage/MainVault)

        // test if withdraw function is accessible to other users
        self.account.link<&Vault>(/public/Vault, target: /storage/MainVault)

        self.account.save(<-create VaultMinter(), to: /storage/MainMinter)

        self.account.link<&VaultMinter>(/private/Minter, target: /storage/MainMinter)
    }

}
