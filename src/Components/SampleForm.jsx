//TODO add check barcode - that it didnt scan twice

import React, {useState, useEffect} from "react";
import "../Styles/SampleFormStyle.css";
import axios from 'axios';
import SampleBag from "./SampleBag";
import {Button, Form} from "react-bootstrap";
import sampleBag from "./SampleBag";

const SampleForm = () => {
    const [seedsWeight, setSeedsWeight] = useState("");
    const [bagNumber, setBagNumber] = useState(1);
    const [sampleBags, setSampleBags] = useState([]);
    const [totalWeight, setTotalWeight] = useState(0);
    const [scannedBarcodes, setScannedBarcodes] = useState([]);


    useEffect(() => {
        console.log("useEffect fires");
        setTotalWeight(getTotalSampleBagWeight());
    }, [sampleBags]);

    function getTotalSampleBagWeight() {
        return sampleBags.reduce((totalWeight, bag) => {
            return totalWeight + parseFloat(bag.bagWeight || 0);
        }, 0);
    }

    //******************** */ Adding new sampleBag ********************
    const handleAddSampleBag = () => {
        const newSampleBag = {bagId: bagNumber, bagWeight: "", bagBarcode: ""};
        setSampleBags((prevSampleBags) => [...prevSampleBags, newSampleBag]);
        setBagNumber((prevBagNumber) => prevBagNumber + 1);
        // setTotalWeight(getTotalSampleBagWeight());
    };
    //******************** */ Removing sampleBag ********************

    const handleRemoveSampleBag = (bagIdToRemove) => {
        setSampleBags((prevSampleBags) => {
            return prevSampleBags.filter(
                (sampleBag) => sampleBag.bagId !== bagIdToRemove
            );
        });
        setBagNumber((prevBagNumber) => prevBagNumber - 1);
        // setTotalWeight(getTotalSampleBagWeight());
    };

    //******************** */ Updating sampleBag ********************

    const handleSampleBagChange = (index, bagData) => {
        setSampleBags((prevSampleBags) => {
            const newSampleBags = [...prevSampleBags];
            newSampleBags[index] = bagData;
            return newSampleBags;
        });
        // setTotalWeight(getTotalSampleBagWeight());
    };

    //******************** */ Check if barcode existed ********************

    const checkIfAllBarcodesUnique = () => {
        const barcodArr = sampleBags.map(sampleBag => sampleBag.bagBarcode)
        const duplicates = barcodArr.filter((value, index) => {
            return barcodArr.indexOf(value) !== index;
        });
        const uniqueDuplicates = [...new Set(duplicates)];
        return uniqueDuplicates;
    };

    // async function handleSubmit(event) {
    //     try {
    //         event.preventDefault();
    //         const uniqueDuplicates = checkIfAllBarcodesUnique();
    //         if (uniqueDuplicates.length === 0) {
    //             const response = await fetch("http://localhost:5000/gene-form", {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json"
    //                 },
    //                 body: JSON.stringify(sampleBags)
    //             });
    //             const data = await response.json();
    //             alert("Form submitted successfully")
    //         } else {
    //             alert("Duplicate barcodes found: " + uniqueDuplicates.join(", "));
    //         }
    //     } catch (error) {
    //         alert(error);
    //     }
    // }
    async function handleSubmit(event) {
        try {
            event.preventDefault();
            const uniqueDuplicates = checkIfAllBarcodesUnique();
            if (uniqueDuplicates.length === 0) {
                const response = await axios.post("http://localhost:5000/gene-form", sampleBags);
                alert("Form submitted successfully");
            } else {
                alert("Duplicate barcodes found: " + uniqueDuplicates.join(", "));
            }
        } catch (error) {
            alert(error);
        }
    }


    return (
        <div className="form-container">
            <h2>Sample Form</h2>
            <div className="form-group">
                <Form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label htmlFor="seedsWeight">Seeds weight (grams):</label>
                        <input
                            type="text"
                            id="seedsWeight"
                            name="seedsWeight"
                            value={seedsWeight}
                            onChange={(e) => setSeedsWeight(e.target.value)}
                        />
                    </div>

                    <div>
                        {sampleBags.map((sampleBag, index) => (
                            <SampleBag
                                key={sampleBag.bagId} // add key prop here
                                id={`scanner-${sampleBag.bagId}`}
                                bagData={sampleBag}
                                onChange={(bagData) => handleSampleBagChange(index, bagData)}
                                removeSampleBag={() => handleRemoveSampleBag(sampleBag.bagId)}
                            />
                        ))}
                        <Button
                            type="button"
                            className={`btn add${
                                getTotalSampleBagWeight(sampleBags) >= seedsWeight &&
                                sampleBags.length > 0
                                    ? " disabled"
                                    : ""
                            }`}
                            disabled={
                                getTotalSampleBagWeight(sampleBags) >= seedsWeight &&
                                sampleBags.length > 0
                            }
                            onClick={handleAddSampleBag}
                        >
                            Add Sample Bag
                        </Button>

                        {/* <button onClick={handleAddSampleBag}>Add New Sample Bag</button> */}
                    </div>

                    <div className="form-group"></div>

                    <div className="form-group">
                        <label htmlFor="totalWeight">Total Weight:</label>
                        <input
                            type="text"
                            id="totalWeight"
                            name="totalWeight"
                            // disabled
                            readOnly
                            value={totalWeight}
                        />
                    </div>

                    <div className="form-group">
                        {/* <Button type="submit" className="btn submit">
              Submit
            </Button> */}
                        <Button
                            type="submit"
                            // btn would be grayed and disabled as long as totalWeight != seedsWeight
                            className={`btn submit${
                                getTotalSampleBagWeight(sampleBags) != seedsWeight &&
                                sampleBags.length > 0
                                    ? " disabled"
                                    : ""
                            }`}
                            // in this setup-> disable get true if 152 in false,
                            //but once disable turns off it wont turn on again when i remove
                            disabled={
                                //false as loge there is a seedsWeight
                                !(seedsWeight > 0) ||
                                // false as long there are sampleBags
                                sampleBags.length == 0 ||
                                // false as long as totalWeight != seedsWeight
                                getTotalSampleBagWeight(sampleBags) != seedsWeight
                            }
                        >
                            Submit
                        </Button>
                    </div>
                    <pre>{JSON.stringify(sampleBags, null, 2)}</pre>
                </Form>
            </div>
        </div>
    );
};
export default SampleForm;
