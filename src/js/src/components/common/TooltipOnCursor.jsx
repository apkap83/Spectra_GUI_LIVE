export const TooltipOnCursor = ({ x, y, message }) => {
  const absolutePosition = {
    top: `${y + 30}px`,
    left: `${x}px`,
  };

  return (
    <div style={absolutePosition} className="tooltipOnCursor">
      {message}
    </div>
  );
};
