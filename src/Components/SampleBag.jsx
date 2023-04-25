import React, { useState } from "react";

import Html5QrcodePlugin from "./Html5QrcodePlugin.jsx";
import { Button } from "react-bootstrap";
// import ScannerComponent from "./ScannerComponent";
// // import { v4 as uuidv4 } from "uuid"; // import uuid

function SampleBag(props) {
  const [bagId, setBagId] = useState(props.bagData.bagId || "");
  const [bagWeight, setBagWeight] = useState(props.bagData.bagWeight || "");
  const [bagBarcode, setBagBarcode] = useState(props.bagData.bagBarcode || "");
  const [decodedResults, setDecodedResults] = useState([]);
  const [scannerHidden, setScannerHidden] = useState(false); // add state variable

  const onNewScanResult = (decodedText, decodedResult) => {
    console.log("App [result]", decodedText);
    setDecodedResults((prev) => [...prev, decodedResult]);
    // handleBagBarcodeChange();
    setBagBarcode(decodedText);
    props.onChange({ ...props.bagData, bagBarcode: decodedText });
  };

  const handleBagIdChange = (event) => {
    setBagId(event.target.value);
    props.onChange({ ...props.bagData, bagId: event.target.value });
  };

  const handleBagWeightChange = (event) => {
    setBagWeight(event.target.value);
    props.onChange({ ...props.bagData, bagWeight: event.target.value });
  };

  const handleBagBarcodeChange = (event) => {
    setBagBarcode(event.target.value);
    props.onChange({ ...props.bagData, bagBarcode: event.target.value });
    setScannerHidden(true);
  };

  const handleRemoveSampleBag = () => {
    props.removeSampleBag(props.bagData.bagId);
  };

  return (
    <div className="sample-bag">
      <div className="form-group">
        <label>
          Bag ID:
          <input
            type="text"
            value={bagId}
            onChange={handleBagIdChange}
            disabled
          />
        </label>
        <label>
          Bag Weight:
          <input
            type="text"
            value={bagWeight}
            onChange={handleBagWeightChange}
          />
        </label>
        <label>
          Bag Barcode:
          <input
            type="text"
            value={bagBarcode}
            onChange={handleBagBarcodeChange}
          />
        </label>
        {bagBarcode ? null : (
          <div className="form-group">
            <div>
              <Html5QrcodePlugin
                key={props.id}
                fps={10}
                qrbox={128}
                disableFlip={true}
                qrCodeSuccessCallback={onNewScanResult}
                readerId={props.id}
              />
            </div>
          </div>
        )}
        {scannerHidden && ( // show the button when the scanner is hidden
          <button
            className="btn"
            onClick={() => {
              setScannerHidden(false);
              setBagBarcode(null);
            }}
          >
            Scan Again
          </button>
        )}
        <Button
          type="button"
          className="btn remove"
          onClick={handleRemoveSampleBag}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
export default SampleBag;
