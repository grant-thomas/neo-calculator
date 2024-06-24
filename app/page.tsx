"use client";

import { useEffect, useState } from "react";
import styles from "../styles/styles.module.css";

import {
  bailerLengths,
  bailerSizeConstants,
  bailerSizes,
  productTypes,
  shearBondStrengths,
  temperatureRanges,
} from "../util/constants";

export default function Home() {
  interface Input {
    dp: number;
    csgSize: number;
    csgWeight: number;
    bailerLength: number;
    bailerSize: number;
    wellDeviation: number;
    temperatureRange: string;
    productType: string;
  }

  const initialInputData = [
    {
      dp: 10000,
      csgSize: 5,
      csgWeight: 11,
      bailerLength: 10,
      bailerSize: 1.375,
      wellDeviation: 0,
      temperatureRange: "70-99",
      productType: "Gray Lid",
    },
  ];

  const [inputData, setInputData] = useState<Input[]>(initialInputData);
  const [error, setError] = useState("");

  const resetState = () => {
    setInputData(initialInputData);
  };

  const renderTableErrorSection = () => {
    if (error)
      return `
				<thead>
					<tr>
							<th colspan="2" style='background: rgb(189, 56, 56, 0.6);'>Error</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td colspan="2">${error}</td>
					</tr>
				</tbody>`;
    return "";
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const htmlContent = `
            <html>
            <head>
                <title>NeoProducts Plug Length Calculations</title>
                <style>
                    @page { size: portrait; }
                    @media print {
                        body { -webkit-print-color-adjust: exact; }
                        table { font-size: 20pt; }
                    }
                    table { font-size: 16pt; }
                    td { padding: 5px; background: rgba(211, 211, 211, 0.1); }
                    th { background: linear-gradient(90deg, rgba(23, 25, 44, 0.5) 0%, rgba(58, 101, 147, 0.5) 110%); }
                </style>
            </head>
            <body>
                <table border="1" id="main-table">
                    <caption style="white-space: nowrap; padding: 10px;">
												<span style="color: red;">Neo</span>Products Plug Length Calculations
                    </caption>
                    <thead>
                        <tr>
                            <th colspan="2">Inputs</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Differential Pressure</td>
                            <td>${inputData[0].dp} psi</td>
                        </tr>
                        <tr>
                            <td>CSG Size</td>
                            <td>${inputData[0].csgSize} in</td>
                        </tr>
                        <tr>
                            <td>CSG Weight</td>
                            <td>${inputData[0].csgWeight} lb/ft</td>
                        </tr>
                        <tr>
                            <td>Well Deviation</td>
                            <td>${inputData[0].wellDeviation} °</td>
                        </tr>
                        <tr>
                            <td>Bailer Length</td>
                            <td>${inputData[0].bailerLength} ft</td>
                        </tr>
                        <tr>
                            <td>Bailer Size</td>
                            <td>${inputData[0].bailerSize} in</td>
                        </tr>
                        <tr>
                            <td>Temperature Range</td>
                            <td>${inputData[0].temperatureRange} °F</td>
                        </tr>
                        <tr>
                            <td>Cement Type</td>
                            <td>${inputData[0].productType}</td>
                        </tr>
                    </tbody>
                    <thead>
                        <tr>
                            <th colspan="2">Outputs</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>~I.D.</td>
                            <td>${
                              calculateID() > 0 &&
                              error !== "Well Deviation is too high!" &&
                              error !==
                                "Red Lid required for temperatures > 350°F" &&
                              error !== "Max temperature for Black Lid is 325°F"
                                ? `${calculateID().toFixed(3)} in`
                                : "-"
                            }</td>
                        </tr>
                        <tr>
                            <td>Volume of Cement</td>
                            <td>${
                              calculateVolume() > 0 &&
                              error !== "Well Deviation is too high!"
                                ? `${calculateVolume().toFixed(1)} gal`
                                : "-"
                            }</td>
                        </tr>
                        <tr>
                            <td>Cement Kits</td>
                            <td>${
                              calculateKitsNeeded() > 0 &&
                              error !== "Well Deviation is too high!"
                                ? `${calculateKitsNeeded()} kits`
                                : "-"
                            }</td>
                        </tr>
                        <tr>
                            <td>Number of Runs</td>
                            <td>${
                              calculateRunsNeeded() > 0 &&
                              error !== "Well Deviation is too high!"
                                ? `${calculateRunsNeeded()} runs`
                                : "-"
                            }</td>
                        </tr>
                        <tr>
                            <td>Cement Plug Length</td>
                            <td>${
                              calculatePlugLength() > 0 &&
                              error !== "Well Deviation is too high!"
                                ? `${calculatePlugLength().toFixed(2)} ft`
                                : "-"
                            }</td>
                        </tr>
                    </tbody>
										${renderTableErrorSection()}
                </table>
                <br>
                <br>
                <table>
                    <tr>
                        <td colspan="2" style="font-size: 16pt;">${new Date().toLocaleString()}</td>
                    </tr>
                </table>
            </body>
            </html>
        `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Failed to open print window.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
    field: string,
    maxValue: number,
    maxChars: number
  ) => {
    let value = e.currentTarget.value;

    // Remove any characters that are not digits or a single decimal point
    value = value.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point is allowed
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // Limit to two decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + "." + parts[1].slice(0, 2);
    }

    const inputLength = e.currentTarget.value.length;

    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];

    if (
      parseInt(value) > maxValue ||
      (inputLength > maxChars &&
        !allowedKeys.includes(value) &&
        (field == "dp" ||
          field == "csgSize" ||
          field == "csgWeight" ||
          field == "wellDeviation"))
    ) {
      e.preventDefault();
    } else {
      const updatedData = inputData.map((row, i) => {
        if (i === index) {
          return { ...row, [field]: value };
        }
        return row;
      });
      setInputData(updatedData);
    }
  };

  // CALCULATIONS
  const calculateFdev = () => {
    if (inputData[0].wellDeviation < 11) return 1.0;
    if (inputData[0].wellDeviation < 41) return 1.2;
    if (inputData[0].wellDeviation < 61) return 1.6;
    if (inputData[0].wellDeviation < 71) return 2.0;
    return -1;
  };

  const calculateID = () => {
    var csgsize = inputData[0].csgSize;
    var csgweight = inputData[0].csgWeight;
    return Math.sqrt(Math.pow(csgsize, 2) - csgweight / (0.785 * 3.480530636));
  };

  const calculateShearStress = () => {
    let index = 0;
    for (let i = 0; i < temperatureRanges.length; i++)
      if (inputData[0].temperatureRange === temperatureRanges[i]) index = i;

    return shearBondStrengths[
      inputData[0].productType
        .toString()
        .split(/[\s-]/)[0]
        .toLowerCase() as keyof typeof shearBondStrengths
    ][index];
  };

  const calculatePlugLength = () => {
    let pluglength: number =
      (2 * inputData[0].dp * inputData[0].csgSize * calculateFdev()) /
      (48 * calculateShearStress());
    return pluglength;
  };

  const calculateVolume = () => {
    let volume: number =
      0.0408 * calculateID() * calculateID() * calculatePlugLength();
    return volume;
  };

  const calculateKitsNeeded = () => {
    let numKits: number = calculateVolume() / 5;
    return Math.ceil(numKits);
  };

  const calculateRunsNeeded = () => {
    let numRuns: number = Math.ceil(
      calculateVolume() /
        (bailerSizeConstants[
          inputData[0].bailerSize as keyof typeof bailerSizeConstants
        ] *
          inputData[0].bailerLength)
    );
    return numRuns;
  };

  useEffect(() => {
    if (calculateFdev() === -1) {
      setError("Well Deviation is too high!");
      return;
    }
    if (
      parseInt(inputData[0].temperatureRange.split("-")[0]) > 350 &&
      inputData[0].productType !== "Red Lid"
    ) {
      setError("Red Lid required for temperatures > 350°F");
      return;
    }
    if (
      parseInt(inputData[0].temperatureRange.split("-")[0]) === 326 &&
      inputData[0].productType === "Black Lid"
    ) {
      setError("Max temperature for Black Lid is 325°F");
      return;
    }
    if (calculatePlugLength() > 0 && calculatePlugLength() < 10) {
      setError(`Always dump a min of 10 ft!
			Increase DP.`);
      return;
    }
    setError("");
  }, [inputData[0]]);

  return (
    <main className={styles.main}>
      <div className={styles.grid}>
        {/* INPUTS */}
        <div className={styles.inputContainer}>
          <div className={styles.input}>
            <label>Differential Pressure</label>
            <input
              type="text"
              pattern="[0-9]*"
              value={inputData[0].dp}
              min={1}
              max={999999}
              onChange={(e) => handleInputChange(e, 0, "dp", 999999, 6)}
              onFocus={(e) => e.target.select()}
            />
            <label className={styles.units}>psi</label>
          </div>
          <div className={styles.input}>
            <label>CSG Size</label>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*\.?[0-9]*"
              value={inputData[0].csgSize}
              min={1}
              max={20}
              step={0.125}
              onChange={(e) => handleInputChange(e, 0, "csgSize", 20, 5)}
              onFocus={(e) => e.target.select()}
            />
            <label className={styles.units}>in</label>
          </div>
          <div className={styles.input}>
            <label>CSG Weight</label>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*\.?[0-9]*"
              value={inputData[0].csgWeight}
              min={1}
              max={150}
              step={0.25}
              onChange={(e) => handleInputChange(e, 0, "csgWeight", 150, 6)}
              onFocus={(e) => e.target.select()}
            />
            <label className={styles.units2}>lb/ft</label>
          </div>
          <div className={styles.input}>
            <label>Well Deviation</label>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*\.?[0-9]*"
              value={inputData[0].wellDeviation}
              min={0}
              max={90}
              onChange={(e) => handleInputChange(e, 0, "wellDeviation", 99, 5)}
              onFocus={(e) => e.target.select()}
            />
            <label className={styles.units}>°</label>
          </div>
          <div className={styles.input}>
            <label>Bailer Length</label>
            <select
              className={styles.select}
              value={inputData[0].bailerLength}
              onChange={(e) => handleInputChange(e, 0, "bailerLength", 60, 2)}
            >
              {bailerLengths.map((length) => (
                <option key={length} value={length}>
                  {length}
                </option>
              ))}
            </select>
            <label className={styles.units}>ft</label>
          </div>
          <div className={styles.input}>
            <label>Bailer Size</label>
            <select
              className={styles.select}
              value={inputData[0].bailerSize}
              onChange={(e) => handleInputChange(e, 0, "bailerSize", 5, 5)}
            >
              {bailerSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <label className={styles.units}>in</label>
          </div>
          <div className={styles.input}>
            <label>Temperature Range</label>
            <select
              className={styles.select}
              value={inputData[0].temperatureRange}
              onChange={(e) =>
                handleInputChange(e, 0, "temperatureRange", 9999, 9999)
              }
            >
              {temperatureRanges.map((temp) => (
                <option key={temp} value={temp}>
                  {temp}
                </option>
              ))}
            </select>
            <label className={styles.units}>°F</label>
          </div>

          <div className={styles.input} style={{ width: "285px" }}>
            <label>Cement Type</label>
            <div className={styles.special}>
              <select
                className={styles.select}
                value={inputData[0].productType}
                onChange={(e) => handleInputChange(e, 0, "productType", 0, 0)}
              >
                {productTypes.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className={styles.outputContainer}>
          <div className={styles.output}>
            <label>~I.D.</label>
            <label>
              {calculateID() > 0 &&
              error !== "Well Deviation is too high!" &&
              error !== "Red Lid required for temperatures > 350°F" &&
              error !== "Max temperature for Black Lid is 325°F" ? (
                calculateID().toFixed(3) + " in"
              ) : (
                <div>-</div>
              )}
            </label>
          </div>

          <div className={styles.output}>
            <label>Volume of Cement</label>
            <label>
              {calculateVolume() > 0 &&
              error !== "Well Deviation is too high!" ? (
                calculateVolume().toFixed(1) + " gal"
              ) : (
                <div>-</div>
              )}
            </label>
          </div>
          <div className={styles.output}>
            <label>Cement Kits</label>
            <label>
              {calculateKitsNeeded() > 0 &&
              error !== "Well Deviation is too high!" ? (
                calculateKitsNeeded() + " kits"
              ) : (
                <div>-</div>
              )}
            </label>
          </div>
          <div className={styles.output}>
            <label>Number of Runs</label>
            <label>
              {calculateRunsNeeded() > 0 &&
              error !== "Well Deviation is too high!" ? (
                calculateRunsNeeded() + " runs"
              ) : (
                <div>-</div>
              )}
            </label>
          </div>
          <div className={styles.output}>
            <label>Cement Plug Length</label>
            <label
              style={{
                color:
                  calculatePlugLength() <= 0 || error
                    ? "white"
                    : calculatePlugLength() < 10
                    ? "red"
                    : "rgb(107, 217, 107)",
              }}
            >
              {calculatePlugLength() > 0 &&
              error !== "Well Deviation is too high!" ? (
                calculatePlugLength().toFixed(2) + " ft"
              ) : (
                <div>-</div>
              )}
            </label>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.buttonDiv}>
            <button className={styles.button} onClick={resetState}>
              Reset
            </button>
            <button className={styles.button} onClick={handlePrint}>
              Print Data
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
