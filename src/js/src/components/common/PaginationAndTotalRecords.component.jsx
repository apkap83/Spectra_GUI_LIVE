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
      display="flex"
      width="100%"
      margin="15px 0px"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <p style={{ fontSize: "1.3rem", marginLeft: "10px" }}>
        <b>Total Records: {recordsNumber}</b>
      </p>

      <Pagination
        sx={{
          marginRight: "10px",
        }}
        page={pageNumber}
        count={pagesCount}
        variant="outlined"
        shape="rounded"
        onChange={handlePageChange}
      />
    </Box>
  );
}
