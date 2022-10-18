import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tickets.css';

export const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [emergency, setEmergency] = useState(false);
  const [openOnly, updateOpenOnly] = useState(false);

  const navigate = useNavigate();

  const localHoneyUser = localStorage.getItem('honey_user');
  const honeyUserObject = JSON.parse(localHoneyUser);

  useEffect(() => {
    if (emergency) {
      const emergencyTickets = tickets.filter(
        (ticket) => ticket.emergency === true
      );
      setFilteredTickets(emergencyTickets);
    } else {
      setFilteredTickets(tickets);
    }
  }, [emergency]);

  useEffect(
    () => {
      const fetchData = async () => {
        const response = await fetch(`http://localhost:8088/serviceTickets`);
        const ticketArray = await response.json();
        setTickets(ticketArray);
      };
      fetchData();
    },
    [] // When this array is empty, you are observing initial component state
  );

  useEffect(() => {
    if (honeyUserObject.staff) {
      //for staff
      setFilteredTickets(tickets);
    } else {
      const myTickets = tickets.filter(
        (ticket) => ticket.userId === honeyUserObject.id
      );
      setFilteredTickets(myTickets);
    }
  }, [tickets]);

  useEffect(() => {
    if (openOnly) {
      const openTicketArray = tickets.filter((ticket) => {
        return (
          ticket.userId === honeyUserObject.id && ticket.dateCompleted === ''
        );
      });
      setFilteredTickets(openTicketArray);
    } else {
      const myTickets = tickets.filter(
        (ticket) => ticket.userId === honeyUserObject.id
      );
      setFilteredTickets(myTickets);
    }
  }, [openOnly]);

  return (
    <>
      {honeyUserObject.staff ? (
        <>
          <button
            onClick={() => {
              setEmergency(true);
            }}
          >
            Emergency Only
          </button>

          <button
            onClick={() => {
              setEmergency(false);
            }}
          >
            Show All
          </button>
        </>
      ) : (
        <>
          <button onClick={() => navigate('/ticket/create')}>
            Create Ticket
          </button>
          <button onClick={() => updateOpenOnly(true)}>Open Ticket</button>
          <button onClick={() => updateOpenOnly(false)}>All Tickets</button>
        </>
      )}

      <h2>List of Tickets</h2>
      <article className="tickets">
        {filteredTickets.map((ticket) => {
          return (
            <section key={ticket.id} className="ticket">
              <header>{ticket.description}</header>
              <footer>Emergency: {ticket.emergency ? '❗' : 'No'}</footer>
            </section>
          );
        })}
      </article>
    </>
  );
};
