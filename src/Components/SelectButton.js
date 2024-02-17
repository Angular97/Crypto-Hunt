import React from "react";

const SelectButton = ({ children, selected, onClick }) => {
  return (
    <span
      onClick={onClick}
      style={{
        border: "1px solid #361848",
        borderRadius: 5,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        fontFamily: "Montserrat",
        cursor: "pointer",
        backgroundColor: selected ? "#361848" : "",
        color: selected ? "white" : "",
        fontWeight: selected ? 700 : 500,
        "&:hover": {
          backgroundColor: "#361848",
          color: "white",
        },
        width: "22%",
      }}
    >
      {children}
    </span>
  );
};

export default SelectButton;
