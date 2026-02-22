import tickets from '../../entities/Ticket.json';
import fareRules from '../../entities/FareRule.json';

export const base44 = {
  entities: {
    Ticket: {
      list: (sort = '', limit = 100) => {
        let sorted = [...tickets];
        if (sort === '-created_date') sorted.reverse();
        return sorted.slice(0, limit);
      },
      filter: (params) => {
        if (!params) return tickets;
        return tickets.filter(t => Object.entries(params).every(([k, v]) => t[k] === v));
      },
      update: (id, data) => {
        const idx = tickets.findIndex(t => t.id === id);
        if (idx >= 0) Object.assign(tickets[idx], data);
        return tickets[idx];
      },
      create: (data) => {
        const newTicket = { ...data, id: (tickets.length + 1).toString() };
        tickets.push(newTicket);
        return newTicket;
      }
    },
    FareRule: {
      list: () => fareRules,
      filter: (params) => {
        if (!params) return fareRules;
        return fareRules.filter(f => Object.entries(params).every(([k, v]) => f[k] === v));
      }
    }
  }
};
