import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import './App.css';

const web3 = new Web3();

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [trans, setTrans] = useState();
  const [showTransactions, setShowTransactions] = useState(false);
  const [accountLook, setAccountLook] = useState()
  const [display, setDisplay] = useState()
  const [nft, setNft] = useState()
  const [nftSearch, setNftSearch] = useState()


  useEffect(() => {
    async function fetchData() {
      try {
        const blockNumber = await alchemy.core.getBlockNumber();
        setBlockNumber(blockNumber);
  
        const transactions = await alchemy.core.getBlockWithTransactions(blockNumber);
        setTrans(transactions);
      } catch (error) {
        // Handle error
      }
    }
  
    fetchData();
  }, []);

  const handleBlockClick = () => {
    setShowTransactions(!showTransactions);
  };

  async function accountSearch(){
    const res = await alchemy.core.getBalance(accountLook, "latest")
    const ether = web3.utils.fromWei(res.toString(), 'ether');
    setDisplay(ether)
  }

  async function floorPrice() {
    const floor = await alchemy.nft.getFloorPrice(nftSearch)
    console.log(floor)
    setNft(floor)

  }





  return (
    <div className="App">
      <div>
        <div id = "center"
          onClick={handleBlockClick}
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
        >
          <h1>Block Number:</h1> <h2>{blockNumber ? blockNumber : "LOADING"}
          ↓</h2></div>
        {showTransactions && trans && trans.transactions ? (
          <div>

           <h1 id='space'> Block Transactions: </h1>
            {trans.transactions.slice(0, 10).map((tx) => {
              const value = tx.value.toString();
              const ethValue = web3.utils.fromWei(value, 'ether');

              return (
                <div id="space" key={tx.hash}>
                  <div>
                    from: {tx.from}
                    <br></br>
                    to: {tx.to}
                    <br></br>
                    value: {ethValue} ETH
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          "Click on the block number to show the last 10 transactions"
        )}
      </div>
      <div>
        <h1>Account Balance Lookup:</h1>
        <input value={accountLook} onChange={(e) => setAccountLook(e.target.value)} />
        <div>balance:{display}</div>
        <button onClick={accountSearch}>Search</button>
      </div>
      <div>
        <h1>floor price of nft search:</h1>
        <button onClick={floorPrice}>Search</button>
        <input value={nftSearch} onChange={(e) => setNftSearch(e.target.value)} />
        <h2>nft floor price: {nft ? nft.openSea.floorPrice : ""} ETH</h2>


      </div>
    </div>
  );
}

export default App;
