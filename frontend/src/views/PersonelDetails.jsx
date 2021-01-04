import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
function PersonelDetails(props) {
  const [items, setItems] = useState([]);

  const handleBulkUpload = () => {
    axios
      .post("http://localhost:8000/bulkUpload/personelDetails", {
        user_details: items
      })
      .then(response => {
        console.log("bulk upload response", response);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const readExcel = file => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = e => {
        const bufferArray = e.target.result;

        console.log("bufferArray -", bufferArray);

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        console.log("wb -", wb);

        const wsname = wb.SheetNames[0];

        console.log("wsname --", wsname);

        const ws = wb.Sheets[wsname];

        console.log("ws ", ws);
        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
        console.log("data", data);
      };

      fileReader.onerror = error => {
        reject(error);
      };
    });

    promise.then(d => {
      setItems(d);
    });
  };

  return (
    <div>
      <input
        type="file"
        onChange={e => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      />

      <table className="table container">
        <thead>
          <tr>
            <th scope="col">user</th>
            <th scope="col">name</th>
          </tr>
        </thead>
        <tbody>
          {items.map(d => (
            <tr key={d.user_id}>
              <th>{d.user_id}</th>
              <td>{d.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br></br>
      <button onClick={handleBulkUpload}>click for bulk upload</button>
    </div>
  );
}

export default PersonelDetails;
