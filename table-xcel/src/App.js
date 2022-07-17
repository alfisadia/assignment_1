import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Body from "./Container/Body";
import Pagination from './Container/Pagination';
import moment from 'moment';
// Allowed extensions for input file
const allowedExtensions = ["csv"];

const App = (props) => {

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
      return (
        <th className="header">
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

  const constructpaginatedData = (ddData) => {
    let initialBatch = {}
    Object.entries(ddData).slice(indexOfFirstTodo, indexOfLastTodo).map(([key, value]) => {
      const aggregate = {};
      value.map((rowValue) => {
        if (key === rowValue.code) {
          aggregate.code = rowValue.code;
          aggregate.name = rowValue.name;
          aggregate.stock = aggregate.stock ? Number(aggregate.stock) + Number(rowValue.stock) : Number(rowValue.stock);
          aggregate.mrp = aggregate.mrp ? (Number(aggregate.mrp) < Number(rowValue.mrp) ? rowValue.mrp : aggregate.mrp) : rowValue.mrp;
          aggregate.rate = aggregate.rate ? (Number(aggregate.rate) < Number(rowValue.rate) ? rowValue.rate : aggregate.rate) : rowValue.rate;
          aggregate.deal = rowValue.deal;
          aggregate.free = rowValue.free;
          aggregate.batch = 'All';
          aggregate.exp = rowValue.exp;
          aggregate.company = rowValue.company;
          aggregate.supplier = rowValue.supplier;
        }
      })
      const newValue = [...value, aggregate];
      initialBatch = { ...initialBatch, [key]: newValue }
    })
    setCurrentRowList(initialBatch);
  }

  useEffect(() => {
    constructpaginatedData(ddData);
  }, [data, ddData, currentPage, todosPerPage])
  //#endregion

  //#region 
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [paginationLength, setPaginationLength] = useState(10);
  const handleSearch = (event) => {
    searchData(search);
  };

  //Paginate on search
  useEffect(() => {
    if (searchResults) {
      setPaginationLength(Object.keys(searchResults).length)
    } else {
      setPaginationLength(Object.keys(ddData).length)
    }
  }, [searchResults])

  const searchData = (searchValue) => {
    const data1 = {};
    Object.entries(data).map(([key, value]) => {
      if (value?.name?.toLowerCase().includes(searchValue.toLowerCase())) {
        if (data1[value.code]) {
          data1[value.code].push(value)
        } else {
          data1[value.code] = [value];
        }
      }
    });
    constructpaginatedData(data1);
    setSearchResults(data1);
  };
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
        <input type='text' value={search} onChange={(e) => {
          if (e.target.value === '') {
            constructpaginatedData(ddData)
            setSearchResults(null);
          }
          setSearch(e.target.value)
        }} />
        <button onClick={handleSearch}>Search by Name</button>
        <table className="table">
          {Header(columns)}
          {/* {error ? error : <Body data={ddData} />} */}
          {error ? error :
            <Body
              data={currentRowList}
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
            totalTodos={paginationLength}
            paginate={paginate}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
