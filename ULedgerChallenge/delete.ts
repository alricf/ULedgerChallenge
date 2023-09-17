import { ULedgerTransactionInputV2, ULedgerTransactionSessionV2, ULedgerBMSSession } from '@uledger/uledger-sdk';
import crypto from 'crypto'

//test key and val
const keyInput: string = "height_cm";
const transactionId = "1df554c002488dec1e5e1683b4def8989e99f568d320b0f7b5f3abee934ff1ad";

async function deleteDataPoint(key: string, transactionId: string) {
  
  const session = new ULedgerBMSSession({
      url: "https://uledger.net/api/v1/bms"
  });  
  
  const trim = false;

  const bmsTxn = await session.searchTransactionById(transactionId, trim);
  const JSpayload = eval('(' + bmsTxn.payload + ')');
  
  //test code output of pre-update payload
  // console.log("JSpayload: ", JSpayload); 

  //test code output of updated payload
  //console.log("\nupdated payload: ", JSpayload, "\ntypeof JSpayload: ", (typeof JSpayload));
  
  JSpayload[key] = null;

  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, 
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
  
  function sha256Hash(data: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex'); // Returns a 64-character hex string 
  }
  
  function printEncodedStringLength(data: string): void {
    const encoder = new TextEncoder();
  
    // Encode as UTF-8
    const encodedString = encoder.encode(data);
  
    // The length of the encoded string gives you the number of bytes
    console.log('Encoded String Length (in bytes):', encodedString.length);
  }
  
  async function create(JSpayload: object) {
    console.log(publicKey)
    printEncodedStringLength(publicKey)
  
    console.log(sha256Hash(publicKey))
    printEncodedStringLength(sha256Hash(publicKey))
  
    const my_address = sha256Hash(publicKey)
  
    try {
      (async () => {
      const txnSession = new ULedgerTransactionSessionV2(
        {
          nodeUrl: "https://node1.network.uledger.io",
          atomicClockUrl: "https://uledger.net/api/v1/acs",
          nodeId: "51c7be67796f168548f0e82306095aeec58989940a9b1aedf1e758df8746d508"
        }
      );
  
      const txnInputData: ULedgerTransactionInputV2 = {
        blockchainId: "f78b4aeb3979871111ae2984de352dee0a3e0da01c1236274dfbfb95e2ee05e3",
        to: my_address, 
        from: my_address, 
        payload: { 
          JSpayload
        },
        payloadType: "DATA",
        senderSignature: "UPDATE THIS AFTER SIGNING AND BEFORE UPLOADING"
      }
  
      const inputString = JSON.stringify(txnInputData.payload)
  
      // Calculate the Keccak (SHA-3) hash using js-sha3
      const hash = sha256Hash(inputString);
  
      console.log('Keccak (SHA-3) Hash of Transaction Payload:', hash);
  
      // Sign the hash with the private key
      const sign = crypto.createSign('RSA-SHA256');
      sign.update(hash);
      const signature = sign.sign(privateKey, 'base64');
  
      // Update the transaction
      txnInputData.senderSignature = sha256Hash(signature);
      printEncodedStringLength(sha256Hash(signature))
      console.log(sha256Hash(signature))
  
      // Send the request to the node
      const txn = await txnSession.createTransaction(txnInputData);
      // Show the result
      console.log(txn);
  
      })();  
    } catch (error) {
        console.log("Fail ", error);
    }
  }
  
  create(JSpayload);
  
};

deleteDataPoint(keyInput, transactionId);

