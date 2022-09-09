import { LinearProgress, Modal } from "@mui/material";
import React, { useContext, useState } from "react";
import { ButtonsDiv, ModalDiv, DeleteButton, CancelButton } from "./styled";
import GraphsContext from "../../../contexts/GraphsContext";
import { updateUserSettingsAWS } from "../../../api/dashboard";
import AuthContext from "../../../contexts/AuthContext";

const DeleteDashboard = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useContext(AuthContext);
  const {
    allDashboards,
    setDashboards,
    selectedDashboard,
    setSelectedDashboard,
  } = useContext(GraphsContext);
  return (
    <Modal
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalDiv>
        <h1>Delete {selectedDashboard} Dashboard?</h1>
        {submitting && (
          <LinearProgress color="inherit" style={{ marginBottom: "10px" }} />
        )}
        <ButtonsDiv>
          <DeleteButton
            disabled={submitting}
            onClick={async () => {
              const updatedDashboards = allDashboards?.filter(
                (dashboard) => dashboard.name !== selectedDashboard
              );
              setSubmitting(true);
              try {
                await updateUserSettingsAWS(
                  user?.username || "",
                  updatedDashboards
                );
              } catch (err) {
                //console.log(err);
              } finally {
                setSubmitting(false);
                setDashboards(updatedDashboards);
                setSelectedDashboard(allDashboards?.[0].name || "");
                handleClose();
              }
            }}
          >
            Delete
          </DeleteButton>
          <CancelButton disabled={submitting} onClick={handleClose}>
            Cancel
          </CancelButton>
        </ButtonsDiv>
      </ModalDiv>
    </Modal>
  );
};

export default DeleteDashboard;
