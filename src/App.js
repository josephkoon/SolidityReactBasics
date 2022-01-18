import { useState } from 'react'
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'

import logo from './logo.svg';
import './App.css';


// Local Test Network
const greeterContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const tokenContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

// Ropsten Test Network
//const greeterContractAddress = '0x1E61c38699d90992D3F9F3A56B66759a4fAF041C'
//const tokenContractAddress = '0x24008340a5380EDc456958BA34223E232D9AC109'

// Token on Etherscan //https://ropsten.etherscan.io/token/0x76f78b006e6B59c501388968bC44c8aa8D0148e1
//const jcContractAddress = '0x76f78b006e6B59c501388968bC44c8aa8D0148e1'


// ERC20 Token Install OpenZeppelin Contracts
// Install using npm @openzeppelin/contracts
// Inherit and mint token (name, symbol, 18 decimal places)
// totalSupply, balanceOf, transferTo, transferFrom, setAllowances


function App() {
    const [greeting, setGreetingValue] = useState('')
    const [userAccount, setUserAccount] = useState('')
    const [amount, setAmount] = useState('')


    //connect to metmask
    async function requestAccount() {
        await window.ethereum.request({method:'eth_requestAccounts'})
    }


    //Get Token Balance
    async function getBalance() {
        //if metamask is connected
        if(typeof window.ethereum !== 'undefined') {
            //connect to wallet
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            
            //connect to token contract
            const contract = new ethers.Contract(tokenContractAddress, Token.abi, provider);
            
            //get account
            const [account] = await window.ethereum.request({method:'eth_requestAccounts'})
            //get balance
            const balance = await contract.balanceOf(account)
            console.log('Balance :', balance.toString())
        }
    }

    async function sendCoins() {
        //if metamask is connected
        if(typeof window.ethereum !== 'undefined') {
            await requestAccount()

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(tokenContractAddress, Token.abi, signer);
            const transaction = await contract.transfer(userAccount, amount);
            await transaction.wait()
            console.log(`${amount} Coins successfully sent to ${userAccount}`)
        }
    }


    //Fetch greeting
    async function fetchGreeting() {
        //if metamask is connected
        if(typeof window.ethereum !== 'undefined') {
            //connect to wallet (provider)
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            //connect to contract 
            const contract = new ethers.Contract(greeterContractAddress, Greeter.abi, provider)

            try {
                //call contract function
                const data = await contract.greet()
                console.log('Data: ', data)
            } catch(err) {
                console.log('Error: ', err)
            }
        }
    }

    //Set greeting
    async function setGreeting() {
        if(!greeting) {
            return
        }

        if(typeof window.ethereum !== 'undefined') {
            //request wallet
            await requestAccount()

            //connect to wallet
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            //get signer for transaction
            const signer = provider.getSigner()
            //connect to contract with signer
            const contract = new ethers.Contract(greeterContractAddress, Greeter.abi, signer)
            //call function with the greeting
            const transaction = await contract.setGreeting(greeting)

            //reset input
            setGreetingValue('')
            //send to network
            await transaction.wait()
            //fetch greeting again
            fetchGreeting()
        }
    }


    return (
        <div className="App">
        <div className='App-header'>
            <br/>
            <h4>Greeting Contract</h4>
            <button onClick={fetchGreeting}>Fetch Greeting</button>
            <button onClick={setGreeting}>Set Greeting</button>
            <input onChange={e => setGreetingValue(e.target.value)} value={greeting} placeholder='Set Greeting' />

            <br/>
            <h4>Token Contract</h4>
            <button onClick={getBalance}>Get Balance</button>
            <button onClick={sendCoins}>Send Coins</button>
            <input onChange={e => setUserAccount(e.target.value)} placeholder='Account ID' />
            <input onChange={e => setAmount(e.target.value)} placeholder='Amount' />
        </div>
        </div>
    );
}

export default App;








