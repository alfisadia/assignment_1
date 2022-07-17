import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Body from "./Container/Body";
import Pagination from './Container/Pagination';
// Allowed extensions for input file
const allowedExtensions = ["csv"];

const App = () => {

  //#region  //Handeling Import from csv file and parsing it.

  // It state will contain the error when
  // correct file extension is not used
  const [error, setError] = useState("");

  // It will store the file uploaded by the user
  const [file, setFile] = useState("");

  // This state will contain column names extracted from file for Table
  const [columns, setColumns] = useState([]);

  // This function will be called when
  // the file input changes
  const handleFileChange = (e) => {
    setError("");

    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }
      setFile(inputFile);
    }
  };

  // This state will store the parsed data
  const [data, setData] = useState([]);
  //Parse the data and convert it into readable format
  const handleParse = () => {
    if (!file) return setError("Enter a valid file");
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      let data = [];
      setColumns(Object.keys(parsedData[0]));
      for (const [key, value] of Object.entries(parsedData)) {
        data.push(value);
        createDropDownData(value);
      }
      setData(data);
    };
    reader.readAsText(file);
  };

  //#endregion
  const [ddData, setDDData] = useState({});
  const createDropDownData = (row) => {
    const data = ddData;
    if (data[row.code]) {
      data[row.code].push(row)
    } else {
      data[row.code] = [row];
    }
    setDDData(data);
  }
  const Header = (data) => {
    return data.map((column) => {
      return (<th>
        {column}
      </th>)
    })
  }

  //#region // Handeling Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage, setTodosPerPage] = useState(10);

  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const [currentRowList, setCurrentRowList] = useState({});

  const handlePagination = (event) => {
    setTodosPerPage(event.target.value);
  }

  useEffect(() => {
    let initialBatch = {}
    Object.entries(ddData).slice(indexOfFirstTodo, indexOfLastTodo).map(([key, value]) => {
      initialBatch = { ...initialBatch, [key]: value }
    })
    setCurrentRowList(initialBatch);
  }, [data, currentPage, todosPerPage])
  //#endregion

  return (
    <div>
      <label htmlFor="csvInput" style={{ display: "block" }}>
        Enter CSV File
      </label>
      <input
        onChange={handleFileChange}
        id="csvInput"
        name="file"
        type="File"
      />
      <div>
        <button onClick={handleParse}>Parse</button>
      </div>
      <div style={{ marginTop: "3rem" }}>
        <table className="table" border={'1px'}>
          {Header(columns)}
          {/* {error ? error : <Body data={ddData} />} */}
          {error ? error :
            <Body
              data={currentRowList}
              currentRowList={currentRowList}
              setCurrentRowList={setCurrentRowList}
            />}

        </table>
        <div className="footer">
          <select onChange={handlePagination}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <Pagination
            currentPage={currentPage}
            todosPerPage={todosPerPage}
            totalTodos={Object.keys(ddData).length}
            paginate={paginate}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
