window.addEventListener("load", async () => {
    if (window.ethereum) {
        // Initialize Web3
        const web3 = new Web3(window.ethereum);

        // Request user accounts
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];
        document.getElementById("user-address").textContent = userAddress;

        // Smart contract ABI and address
        const contractABI = [
            {
                "inputs": [],
                "name": "deposit",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "withdraw",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getBalance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ];
        const contractAddress = "0xf211b7F457dB3545F442E7bd46A5AFd39CE41c44";
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        // Update balance on page load
        async function updateBalance() {
            const balance = await contract.methods.getBalance().call({ from: userAddress });
            document.getElementById("user-balance").textContent = web3.utils.fromWei(balance, "ether") + " ETH";
        }

        updateBalance();

        // Deposit ETH
        document.getElementById("deposit-btn").onclick = async () => {
            const depositAmount = document.getElementById("deposit-amount").value;
            if (depositAmount <= 0) {
                document.getElementById("error-message").textContent = "Please enter a valid amount to deposit.";
                return;
            }
            try {
                await contract.methods.deposit().send({
                    from: userAddress,
                    value: web3.utils.toWei(depositAmount, "ether")
                });
                document.getElementById("error-message").textContent = "";
                updateBalance();
            } catch (error) {
                document.getElementById("error-message").textContent = "Error while depositing: " + error.message;
            }
        };

        // Withdraw ETH
        document.getElementById("withdraw-btn").onclick = async () => {
            const withdrawAmount = document.getElementById("withdraw-amount").value;
            if (withdrawAmount <= 0) {
                document.getElementById("error-message").textContent = "Please enter a valid amount to withdraw.";
                return;
            }
            try {
                await contract.methods.withdraw(web3.utils.toWei(withdrawAmount, "ether")).send({ from: userAddress });
                document.getElementById("error-message").textContent = "";
                updateBalance();
            } catch (error) {
                document.getElementById("error-message").textContent = "Error while withdrawing: " + error.message;
            }
        };
    } else {
        alert("Please install MetaMask to use this DApp.");
    }
});
