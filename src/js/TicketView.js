/**
 *  Класс для отображения тикетов на странице.
 *  Он содержит методы для генерации разметки тикета.
 * */

import Form from "./Form";

export default class TicketView {
  constructor(ticket, callback) {
    this.ticket = ticket;
    this.callback = callback;
  }

  render() {
    const cont = document.createElement('div');
    cont.className = 'ticketCont';
    cont.dataset.id = this.ticket.id;

    const shortInfoCont = document.createElement('div');
    shortInfoCont.className = 'shortInfoCont';

    shortInfoCont.append(this.createCheckbox());
    shortInfoCont.append(this.createBodyBox());
    shortInfoCont.append(this.createBtnsbox());

    cont.append(shortInfoCont);
    cont.append(this.createDescCont());
    
    return cont
  }

  startRender() {
    
  }

  createCheckbox() {
    const cbx = document.createElement('input');
    cbx.className = 'ticketCbx';
    cbx.type = 'checkbox';
    cbx.checked = this.ticket.status;
    
    return cbx;
  }

  createTextbox() {
    const cont = document.createElement('div');
    cont.className = 'ticketTextCont';
    cont.textContent = this.ticket.name;

    return cont;
  }

  createDatebox() {
    const cont = document.createElement('div');
    cont.className = 'ticketDateCont';
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timezone: 'UTC',
      hour: 'numeric',
      minute: 'numeric'
    };
    cont.textContent = (new Date(this.ticket.created)).toLocaleDateString("ru", options);

    return cont;
  }

  createBtnsbox() {
    const cont = document.createElement('div');
    cont.className = 'ticketBtnsCont';
    cont.append(this.createEditBtn());
    cont.append(this.createDelBtn());

    return cont;
  }

  createEditBtn() {
    const editBtn = document.createElement('button');
    editBtn.classList = 'btn ticketBtn editBtn';
    editBtn.type = 'button';

    editBtn.addEventListener('click', e => {
      const popup = document.querySelector('.popupCont');
      if (popup) {
        popup.textContent = '';
        //const form = new Form('edit', tickId);
        const form = this.callback('edit');
        popup.style.display = 'block';
        popup.append(form.create());
      }

    })

    return editBtn;
  }

  createDelBtn() {
    const delBtn = document.createElement('button');
    delBtn.classList = 'btn ticketBtn delBtn';
    delBtn.type = 'button';
    delBtn.addEventListener('click', e => {
      const popup = document.querySelector('.popupCont');
      if (popup) {
        popup.textContent = '';
        //const form = new Form('delete', this.ticket.id);
        const form = this.callback('delete');
        popup.style.display = 'block';
        //popup.append(form.create());
      }
    })
    return delBtn;
  }

  createDescCont() {
    const cont = document.createElement('div');
    cont.className = 'descCont';
    cont.textContent = this.ticket.description;

    return cont;
  }

  createBodyBox() {
    const cont = document.createElement('div');
    cont.className = 'bodyCont';
    cont.append(this.createTextbox());
    cont.append(this.createDatebox());

    if (this.ticket.description !== '') {
      cont.addEventListener('click', e => {
        const tickets = document.querySelectorAll('.ticketCont');
        tickets.forEach(ticket => {
          if (ticket.dataset.id === this.ticket.id) {
            const descCont = ticket.querySelector('.descCont');
            descCont.classList.toggle('descContVisible');
          }
        })
      })
    }

    return cont;
  }
}
