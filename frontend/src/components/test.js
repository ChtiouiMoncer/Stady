<Snackbar
open={snackbarOpen}
autoHideDuration={6000}
onClose={handleClose}
action={
    <React.Fragment>
    <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => setSnackbarOpen(false)}
    >
        <CloseIcon fontSize="small" />
    </IconButton>
    </React.Fragment>
}
>
<Alert
onClose={handleClose}
severity={success ? "success" : "error"}
sx={{ width: '100%' }}
>
    {success ? (
    'You successfully Updated You Profile!'
    ) : errMsg} 
</Alert>
</Snackbar>        


const handleReject = async (id) => {
    const PATCH_RESERVATION_URL = `/api/reservations/${id}`;
  
    try {
      const response = await axiosPrivate.patch(PATCH_RESERVATION_URL,
        JSON.stringify({
            isCancelled: true,
        }),
        {
          headers: {'Content-Type' : 'application/merge-patch+json'},
        }
      );
      setSnackbarOpen(true);   
      setErrMsg('');
      setSuccess(true);
     
    } catch (err) {

      setIsPending(false);
    if (err?.response?.data['hydra:description'] === "Cannot cancel a reservation that is outdated.") {
        setErrMsg("Soory, but we can't cancel a reservation that is Outdated!");
    } else if (err?.response?.data['hydra:description'] === "Cannot cancel a reservation that has a timeslot starting less than 10 minutes from now.") {
        setErrMsg("Soory, but we can't can't cancel a reservation that has a timeslot starting less than 10 minutes from now.");
    } else if (err?.response?.data['hydra:description'] === "Cannot cancel a reservation that is already available") {
        setErrMsg("Soory, but we can't can't cancel a reservation that is already available");
    } 
    setSnackbarOpen(true); 
    }
    // Refresh data after rejecting
    getUserInfo();
  };