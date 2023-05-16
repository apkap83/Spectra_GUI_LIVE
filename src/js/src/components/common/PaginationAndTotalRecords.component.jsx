import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";

export function PaginationAndTotalRecords({
  recordsNumber,
  pageNumber,
  pagesCount,
  handlePageChange,
}) {
  return (
    <Box
      float="right"
      display="flex"
      width="auto"
      height="80px"
      marginLeft="1rem"
      marginTop="20px"
      marginBottom="50px"
      // bgcolor="lightgreen"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <p>
        <b>Total Records: {recordsNumber}</b>
      </p>

      <Pagination
        page={pageNumber}
        count={pagesCount}
        variant="outlined"
        shape="rounded"
        onChange={handlePageChange}
      />
    </Box>
  );
}
