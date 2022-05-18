import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';

const exportSimpleExcel = (columnHeaders, lines, nameSheet, nameDocument) => {
    let wb = XLSX.utils.book_new();
    wb.Props = {
    Title: nameSheet,
    CreatedDate: new Date()
    };
    wb.SheetNames.push(nameSheet);

    let ws_data = [columnHeaders];
    lines.forEach(line => {
        ws_data.push(line);
    })

    let ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets[nameSheet] = ws;
    let wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

    function s2ab(s) { 
    let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    let view = new Uint8Array(buf);  //create uint8array as viewer
    for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
    }
    
    saveAs(new Blob([s2ab(wbout)],{type:'application/octet-stream'}), nameDocument + '.xlsx');
}

const excel = {
    exportSimpleExcel
}

export default excel;