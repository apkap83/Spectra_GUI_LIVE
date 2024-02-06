export const Footer = ({ rowsPerPage, handleRowsPerPage }) => {
  return (
    <div className="datagridWrapper__rowsPerPage">
      <span className="datagridWrapper__rowsPerPage__span">Rows Per Page:</span>
      <input
        className="datagridWrapper__rowsPerPage__input"
        type="number"
        value={rowsPerPage}
        onChange={handleRowsPerPage}
      />
    </div>
  );
};
