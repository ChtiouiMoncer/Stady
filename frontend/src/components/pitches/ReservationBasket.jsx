const ReservationBasket = ({ selectedTimeslots }) => {
    const total = selectedTimeslots.reduce((sum, timeslot) => sum + timeslot.price, 0);
    const fees = 2;  // Static for now. Change it based on your requirements.
    const finalTotal = total + fees;
    return (
        <div>
        <h2>Timeslots:</h2>
        {selectedTimeslots.map((timeslot, index) => (
          <p key={index}>{timeslot.startTime} - {timeslot.endTime}</p>
        ))}
        <h2>Price: {total} DT</h2>  
        <h2>Fees: {fees} DT</h2>    
        <h2>Total: {finalTotal} DT</h2>  
        <button>Reserve</button>
      </div>
      );
}
 
export default ReservationBasket;