import { fIsBetween } from "src/utils/format-time";

export function applyFilter({ inputData, comparator, filters, dateError, userRole }) {
  const { name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((ledgers) =>
      ledgers.ledger?.toLowerCase()?.includes(name.toLowerCase()) || // Use optional chaining
      ledgers.voucherNo?.toLowerCase()?.includes(name.toLowerCase()) ||
      ledgers.voucherType?.toLowerCase()?.includes(name.toLowerCase()) ||
      ledgers.debitAmount?.toString()?.includes(name.toLowerCase()) ||
      ledgers.creditAmount?.toString()?.includes(name.toLowerCase()))
  }


  if (!dateError && startDate && endDate) {
    inputData = inputData.filter((ledgers) =>
      fIsBetween(ledgers.date, startDate, endDate)
    );
  }

  return inputData;
}


