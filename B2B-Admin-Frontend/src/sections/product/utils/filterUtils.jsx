export function applyFilter({ inputData, comparator, filters }) {
  const { searchTerm, status } = filters;

  // Start by filtering based on status
  let filteredData = inputData;

  // Filter by status (only filter if the status is not 'all')
  if (status !== 'all') {
    filteredData = filteredData.filter((item) => item.status === status);
  }

  // If there's a search term, filter by first name, last name, or email
  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();

    filteredData = filteredData.filter((item) =>
      item.itemName.toLowerCase().includes(lowerSearchTerm) ||
      item.group.toLowerCase().includes(lowerSearchTerm) ||
      item.category.toLowerCase().includes(lowerSearchTerm) ||
      item.costPrice.toString().includes(lowerSearchTerm) ||
      item.sellingPrice.toString().includes(lowerSearchTerm) ||
      item.mrpRate.toString().includes(lowerSearchTerm) 

    )
  }

  // Sort the filtered data using the comparator
  return filteredData.sort(comparator);
}

