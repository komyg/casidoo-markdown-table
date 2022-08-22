export const input = `| Syntax | Description |
| --- | ----------- |
| Header | Title |
| Paragraph | Text |
`;

function formatMarkdownTable(table: string): string {
  const rows = table.split('\n');
  const columns = getTableColumns(rows);

  const updatedColumns = padColumnsCells(columns);
  const updatedRows = transposeColumns(updatedColumns);
  return recreateTable(updatedRows);
}

function getTableColumns(rows: string[]): string[][] {
  const getColumnsValues = (column: string) =>
    column
      .split('|')
      .map((str) => str.trim())
      .filter((str) => !!str);

  const initResult = () => {
    const columns = getColumnsValues(rows[0]);
    return columns.map(() => []);
  };

  const separateColumns = (row: string, result: string[][]) => {
    const columns = getColumnsValues(row);
    for (const [colIndex, column] of columns.entries()) {
      result[colIndex].push(column);
    }
  };

  const result: string[][] = initResult();
  for (const row of rows) {
    separateColumns(row, result);
  }

  return result;
}

function padColumnsCells(columns: string[][]) {
  const findLargestCell = (cells: string[]) =>
    cells
      .filter((cellValue) => !cellValue.includes('--')) // Ignore separator cells | --- |
      .reduce(
        (result, cellValue) =>
          cellValue.length > result ? cellValue.length : result,
        0
      );

  const padCells = (cells: string[]) => {
    const largestCell = findLargestCell(cells);
    const padCell = (paddingChar: string, cellValue: string) =>
      cellValue + paddingChar.repeat(largestCell - cellValue.length);

    return cells.map((cellValue) => {
      if (cellValue.length === largestCell) {
        return cellValue;
      }

      return cellValue.includes('--')
        ? padCell('-', cellValue)
        : padCell(' ', cellValue);
    });
  };

  return columns.map(padCells);
}

function transposeColumns(columns: string[][]) {
  const initResult = () => {
    const rows = columns[0];
    return rows.map(() => []);
  };

  const result: string[][] = initResult();
  for (const columnSet of columns) {
    for (const [index, cell] of columnSet.entries()) {
      result[index].push(cell);
    }
  }

  return result;
}

function recreateTable(rows: string[][]) {
  let result = '';
  for (const row of rows) {
    result += '|';
    for (const col of row) {
      result += ` ${col} |`;
    }
    result += '\n';
  }

  return result;
}

const result = formatMarkdownTable(input);
console.log(result);
