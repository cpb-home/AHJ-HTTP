/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */
export default class TicketService {

  static list(callback) {
    fetch('http://localhost:3005/?method=allTickets', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(ticketsArr => callback(ticketsArr))
      .catch(e => { throw new Error(`Ошибка получения всех тикетов: ${e}`) })
  }

  static get(id, callback) {
    fetch(`http://localhost:3005/?method=ticketById&id=${id}`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(ticketsArr => callback(ticketsArr))
      .catch(e => { throw new Error(`Ошибка получения тикета по ид: ${e}`) })
  }

  static create(data, callback) {
    fetch('http://localhost:3005/?method=createTicket', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => callback(res))
      .catch(e => { throw new Error(`Ошибка создания тикета: ${e}`) })
  }

  static update(id, data, callback) {
    fetch(`http://localhost:3005/?method=updateById&id=${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => callback(res))
      .catch(e => { throw new Error(`Ошибка создания тикета: ${e}`) })
  }

  static delete(id, callback) {
    fetch(`http://localhost:3005/?method=deleteById&id=${id}`, {
      method: 'GET',
    })
      .then(res => callback(res))
      .catch(e => { throw new Error(`Ошибка получения всех тикетов: ${e}`) })
  }
}
