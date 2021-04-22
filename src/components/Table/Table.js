// from: https://javascript.plainenglish.io/how-to-create-a-custom-table-component-in-react-7c37ad7a6518

import React from "react";
import TableRow from "./TableRow";
import TableHeadItem from "./TableHeadItem";

const Table = ({ tHeadData, tBodyData, customClass }) => {
    return (
        <table  className={"table"}>
            <thead>
                <tr>
                    {tHeadData.map((h) => {
                        return <TableHeadItem key={h} item={h} />;
                    })}
                </tr>
            </thead>
            <tbody>
                {tBodyData.map((item) => {
                    return <TableRow key={item.id} data={item.items} />;
                })}
            </tbody>
        </table>
    );
};

export default Table;