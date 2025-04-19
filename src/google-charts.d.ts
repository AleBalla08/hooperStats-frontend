declare namespace google {
    export namespace visualization {

      export interface DataTable {
        addColumn(type: string, label: string): void;
        addRows(rows: [string, number | string]): void; 
      }
  
      export function arrayToDataTable(data: [string, number | string][]): DataTable;
  
      export class PieChart {
        constructor(element: HTMLElement);
        draw(data: DataTable, options: object): void;
      }
  
      export class BarChart {
        constructor(element: HTMLElement);
        draw(data: DataTable, options: object): void;
      }
    }
  
    export namespace charts {
      export function load(version: string, options: { packages: string[] }): void;
      export function setOnLoadCallback(callback: () => void): void;
    }
  }
  
  
  