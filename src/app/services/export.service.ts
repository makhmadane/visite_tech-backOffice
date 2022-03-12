import { Injectable, ElementRef } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {  read, utils } from 'xlsx';

const EXCEL_EXTENSION = '.xlsx';
const CSV_EXTENSION = '.csv';
const CSV_TYPE = 'text/csv';


@Injectable()
export class ExportService {

    
  constructor() { }

  public exportTableElmToExcel(element: ElementRef, fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element.nativeElement);
    // generate workbook and add the worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
    // save to file
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }


  ////////////////////////
  /**
   * Creates XLSX option from the Json data. Use this to customize the sheet by adding arbitrary rows and columns.
   *
   * @param json Json data to create xlsx.
   * @param fileName filename to save as.
   */
  public exportJsonToExcel(json: any[], fileName: string): void {
    // inserting first blank row
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json[0].data, this.getOptions(json[0]));
    for (let i = 1, length = json.length; i < length; i++) {
      // adding a dummy row for separation
      XLSX.utils.sheet_add_json(worksheet, [{}], this.getOptions({data: [], skipHeader: true }, -1) );
      XLSX.utils.sheet_add_json(worksheet, json[i].data, this.getOptions(json[i], -1) );
    }
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet }, SheetNames: ['Sheet1'] };
    // save to file
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  /**
   * Creates the XLSX option from the data.
   *
   * @param json Json data to create xlsx.
   * @param origin XLSX option origin.
   * @returns options XLSX options.
   */
  private getOptions(json: any, origin?: number): any {
    // adding actual data
    const options = { skipHeader: true, origin: -1, header: [] };
    options.skipHeader = json.skipHeader ? json.skipHeader : false;
    if (!options.skipHeader && json.header && json.header.length) { options.header = json.header; }
    if (origin) { options.origin = origin ? origin : -1; }
    return options;
  }


  ///////////////////////////////////CSV//////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  private saveAsFile(buffer: any, fileName: string, fileType: string): void {
    const data: Blob = new Blob([buffer], { type: fileType });
    FileSaver.saveAs(data, fileName);
  }


  public exportToCsv(rows: any[], fileName: string, columns?: string[]): string {
    if (!rows || !rows.length) { return; }
    const separator = ',';
    const keys = Object.keys(rows[0]).filter(k => {
      if (columns?.length) { return columns.includes(k); } else { return true; }
    });
    const csvContent = keys.join(separator) + '\n' + rows.map(row => {
      return keys.map(k => {
        let cell = row[k] === null || row[k] === undefined ? '' : row[k];
        cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) { cell = `"${cell}"`; }
        return cell;
      }).join(separator);
    }).join('\n');
    this.saveAsFile(csvContent, `${fileName}${CSV_EXTENSION}`, CSV_TYPE);
  }


  convertExcelToJson(file){
    let reader = new FileReader();
    let workbookkk, XL_row_object;
    reader.readAsBinaryString(file);
    return new Promise((resolve, reject) => {
      reader.onload = function(){
        let data = reader.result;
        workbookkk=read(data,{type: 'binary'});
        workbookkk.SheetNames.forEach(function(sheetName) {
          XL_row_object = utils.sheet_to_json(workbookkk.Sheets[sheetName]);
          resolve(XL_row_object);
        });
      };
    });
  }
  

  convertCsvToJson(file){
    let reader = new FileReader();
    if (file.name.endsWith(CSV_EXTENSION)) {
      reader.readAsText(file);
      return new Promise((resolve, reject) => {
        reader.onload = function(){
          const csvRecordsArray = reader.result.toString().split(/\r\n|\n/);
          const headers = (csvRecordsArray[0]).split(';');
          let headerArray = [];
          for (let j = 0; j < headers.length; j++) { headerArray.push(headers[j]); }
          for (let i = 1; i < csvRecordsArray.length; i++) {
            let curruntRecord = (csvRecordsArray[i]).split(';');
            if (curruntRecord.length == headerArray.length) {
              resolve(curruntRecord);
            }
          }
        };
      });
    }
  }
  
}