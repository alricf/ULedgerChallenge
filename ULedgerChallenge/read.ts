import { ULedgerBMSSession } from "@uledger/uledger-sdk";

async function transactionByBlockId() {

  const session = new ULedgerBMSSession({
       url: "https://uledger.net/api/v1/bms"
  });
  
  const trim = false;

  
  const transactionId = "1df554c002488dec1e5e1683b4def8989e99f568d320b0f7b5f3abee934ff1ad";
  
  const bmsTxn = await session.searchTransactionById(transactionId, trim);
  console.log("Retreived transaction by ID:\n", bmsTxn);

} 

transactionByBlockId();