  import React from "react";
  import { Switch } from "antd";
  import { Modal } from "antd";

  const ConfirmSwitch = ({ checked, onToggle, name }) => {
    const handleChange = (newValue) => {
      
      if (checked && !newValue) {
        Modal.confirm({
          title: "Confirm Action",
          content: `Are you sure you want to block ${name}?`,
          okText: "Yes",
          cancelText: "No",
          onOk: () => {
            onToggle(); 
          },
        });
      } else {
        onToggle();
      }
    };

    return <Switch checked={checked} onChange={handleChange} />;

  };

  export default ConfirmSwitch;
