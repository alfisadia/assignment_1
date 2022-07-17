import React, { useEffect, useState } from "react";
import Papa from "papaparse";



export default ({ data }) => {
    const [currentRowList, setCurrentRowList] = useState({});
    useEffect(()=>{
        let initialBatch = {}
        Object.entries(data).map(([key,value])=>{
            initialBatch = {...initialBatch, [key]:value[0]}
        })
        setCurrentRowList(initialBatch);
    },[data])
    const handleChange = (e, row) => {
        let filterData = row.find((r) => r.batch === e.target.value);
        setCurrentRowList({...currentRowList, [row[0].code]:filterData});
    }
    const displayCurrentRow = (dataToBeDisplayed) => {
        return (dataToBeDisplayed && <>
            <td>
                {dataToBeDisplayed.stock}
            </td>
            <td>
                {dataToBeDisplayed.deal}
            </td>
            <td>
                {dataToBeDisplayed.free}
            </td>
            <td>
                {dataToBeDisplayed.mrp}
            </td>
            <td>
                {dataToBeDisplayed.rate}
            </td>
            <td>
                {dataToBeDisplayed.exp}
            </td>
            <td>
                {dataToBeDisplayed.company}
            </td>
            <td>
                {dataToBeDisplayed.supplier}
            </td>
        </>)
    }
    const displayData = () => {
        return Object.entries(data).map(([key, value]) => {
            return (<tr>
                <td>
                    {key}
                </td>
                <td>
                    {value ? value[0]?.name : ''}
                </td>
                <td>
                    <select name={key} onChange={(e) => handleChange(e, value)}>
                        {value && value.map(
                            (column) => {
                                return (
                                    <option value={column.batch}>{column.batch}</option>
                                )
                            }
                        )}
                    </select>
                </td>
                {displayCurrentRow(currentRowList[key])}
            </tr>)
        })
    }
    return (<>
        {displayData()}
    </>)
}