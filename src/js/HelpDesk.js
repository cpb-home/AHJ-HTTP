import TicketService from "./TicketService";
import Ticket from "./Ticket";

/**
 *  Основной класс приложения
 * */
export default class HelpDesk {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error("This is not HTML element!");
    }
    this.container = container;
  }

  init() {
    const ticketsCont = this.createTicketsCont();
    this.container.append(ticketsCont);

    this.getData();

    return this.container;
  }

  createTicketsCont() {
    const block = document.createElement('div');
    block.className = 'pageCont';

    const popup = this.createPopup();
    block.append(popup);

    const addBtnCont = this.createAddBtnCont();
    block.append(addBtnCont);

    const list = this.createTicketsListCont();
    block.append(list);

    return block;
  }

  createPopup() {
    const block = document.createElement('div');
    block.className = 'popupCont';
    return block;
  }

  createAddBtnCont() {
    const block = document.createElement('div');
    block.className = 'addBtnCont';

    const addBtn = this.createAddBtn();
    block.append(addBtn);

    return block;
  }

  createAddBtn() {
    const btn = this.createBtn('Добавить тикет', 'button');
    btn.addEventListener('click', (e) => {
      const popup = document.querySelector('.popupCont');
      if (popup) {
        popup.textContent = '';
        const form = this.createForm('add');
        popup.style.display = 'block';
        popup.append(form);
      }
    })
    return btn;
  }

  createForm(type, id = null) {
    const form = document.createElement('form');
    form.classList = 'form';

    const header = document.createElement('h3');
    
    switch (type) {
      case 'delete':
        header.textContent = 'Удалить тикет';
        form.append(header);
        const txt = document.createElement('p');
        txt.textContent = 'Вы уверены, что хотите удалить данный тикет? Это действие нельзя будет отменить.'
        form.append(txt);
        form.append(this.createBtnsCont());  
        break;
      case 'edit':
        header.textContent = 'Изменить тикет';
        form.append(header);

        form.append(this.createShortLabel());
        form.append(this.createInput('edit', id));
        form.append(this.createLongLabel());
        form.append(this.createTextarea('edit', id));
        form.append(this.createBtnsCont());
        break;
      case 'add':
        header.textContent = 'Добавить тикет';
        form.append(header);

        form.append(this.createShortLabel());
        form.append(this.createInput('add'));
        form.append(this.createLongLabel());
        form.append(this.createTextarea('add'));
        form.append(this.createBtnsCont());
        break;
      default:
        header.textContent = 'Ошибка: что-то пошло не так!';
        form.append(header);
    }

    form.addEventListener('submit', e => {
      e.preventDefault();

      if (type === 'delete') {
        TicketService.delete(id, (res) => {
          if (res.status === 204) {
            const popup = document.querySelector('.popupCont');
            popup.textContent = '';
            popup.style.display = 'none';
            this.getData();
          }
        });
      }

      if (type === 'edit') {
        const data = {name: e.target.elements.shortTextInp.value, description: e.target.elements.longTextInp.value};
        TicketService.update(id, data, (res) => {
          if (res.status === 200) {
            const popup = document.querySelector('.popupCont');
            popup.textContent = '';
            popup.style.display = 'none';
            this.getData();
          }
        });
      }

      if (type === 'add') {
        const data = {name: e.target.elements.shortTextInp.value, description: e.target.elements.longTextInp.value};
        TicketService.create(data, (res) => {
          if (res.status === 200) {
            const popup = document.querySelector('.popupCont'); 
            popup.textContent = '';
            popup.style.display = 'none';
            this.getData();
          }
        });
      }
    })

    return form;
  }



  createTicketsListCont() {
    const block = document.createElement('div');
    block.className = 'ticketList';
    block.textContent = 'Пока нет записей';

    return block;
  }

  

  createBtn(text, type) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.type = type;
    btn.textContent = text;
    btn.value = text;
    return btn;
  }

  

  getData() {
    TicketService.list((ticketsArr) => {
      if (typeof ticketsArr === 'number') {
        const page = document.querySelector('.pageCont');
        const mess = document.createElement('h1');
        mess.textContent = 'Не обнаружен сервер на порту 3005';
        page.textContent = '';
        page.append(mess);
      } else {
        localStorage.setItem('tickets', JSON.stringify(ticketsArr));

        const ls = JSON.parse(localStorage.getItem('tickets'));
      
        const ticketList = document.querySelector('.ticketList');
        ticketList.textContent = '';
        if (ls.length > 0) {
          ticketList.textContent = '';
          for (let i = 0; i < ls.length; i++) {
            const ticket = new Ticket(ls[i]);
            const ticketCont = this.renderTicketCont(ticket);
            ticketList.append(this.renderTicketCont(ticket));      
          }
        } else {
          ticketList.textContent = 'Пока нет записей';
        }
      }
    });
    
  }






  createShortLabel() {
    const shortLabel = this.createLabel('shortTextInp', 'Краткое описание');
    return shortLabel;
  }

  createLongLabel() {
    const longLabel = this.createLabel('longTextInp', 'Подробное описание');
    return longLabel;
  }

  createLabel(forEl, text) {
    const label = document.createElement('label');
    label.htmlFor = forEl;
    label.className = 'label';
    label.textContent = text;
    return label;
  }

  createTextarea(type, id = null) {
    const area = document.createElement('textarea');
    area.classList = 'field longTextInp';
    area.id = 'longTextInp';
    area.name = 'description';
    area.required = true;
    area.placeholder = 'Введите подробное описание';
    if (type === 'edit') {
      TicketService.get(id, (ticket) => {
        area.value = ticket.description || '';
      });
    }
    return area;
  }

  createInput(type, id = null) {
    const input = document.createElement('input');
    input.classList = 'field shortTextInp';
    input.id = 'shortTextInp';
    input.type = 'text';
    input.name = 'name';
    input.required = true;
    input.placeholder = 'Введите краткое описание';
    
    if (type === 'edit') {
      TicketService.get(id, (ticket) => {
        input.value = ticket.name || '';
      });
    }

    return input;
  }

  createBtn(text, type) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.type = type;
    btn.textContent = text;
    btn.value = text;
    return btn;
  }

  createBtnsCont() {
    const block = document.createElement('div');
    block.className = 'btnsCont';

    const btnCancell = this.createBtn('Отмена', 'button');
    btnCancell.addEventListener('click', (e) => {
      const popup = document.querySelector('.popupCont');
      if (popup) {
        popup.style.display = 'none';
      }
    })
    block.append(btnCancell);

    const btnOk = this.createBtn('Ok', 'submit');
    block.append(btnOk);

    return block;
  }







  renderTicketCont(ticket) {
    const cont = document.createElement('div');
    cont.className = 'ticketCont';
    cont.dataset.id = ticket.id;

    const shortInfoCont = document.createElement('div');
    shortInfoCont.className = 'shortInfoCont';

    shortInfoCont.append(this.createCheckbox(ticket));
    shortInfoCont.append(this.createBodyBox(ticket));
    shortInfoCont.append(this.createBtnsbox(ticket));

    cont.append(shortInfoCont);
    cont.append(this.createDescCont(ticket));
    
    return cont
  }

  createCheckbox(ticket) {
    const cbx = document.createElement('input');
    cbx.className = 'ticketCbx';
    cbx.type = 'checkbox';
    cbx.checked = ticket.status;
    
    return cbx;
  }

  createTextbox(ticket) {
    const cont = document.createElement('div');
    cont.className = 'ticketTextCont';
    cont.textContent = ticket.name;

    return cont;
  }

  createDatebox(ticket) {
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
    cont.textContent = (new Date(ticket.created)).toLocaleDateString("ru", options);

    return cont;
  }

  createBtnsbox(ticket) {
    const cont = document.createElement('div');
    cont.className = 'ticketBtnsCont';
    cont.append(this.createEditBtn(ticket));
    cont.append(this.createDelBtn(ticket));

    return cont;
  }

  createEditBtn(ticket) {
    const editBtn = document.createElement('button');
    editBtn.classList = 'btn ticketBtn editBtn';
    editBtn.type = 'button';

    editBtn.addEventListener('click', e => {
      const popup = document.querySelector('.popupCont');
      if (popup) {
        popup.textContent = '';
        const form = this.createForm('edit', ticket.id);
        popup.style.display = 'block';
        popup.append(form);
      }

    })

    return editBtn;
  }

  createDelBtn(ticket) {
    const delBtn = document.createElement('button');
    delBtn.classList = 'btn ticketBtn delBtn';
    delBtn.type = 'button';
    delBtn.addEventListener('click', e => {
      const popup = document.querySelector('.popupCont');
      if (popup) {
        popup.textContent = '';
        const form = this.createForm('delete', ticket.id);
        popup.style.display = 'block';
        popup.append(form);
      }
    })
    return delBtn;
  }

  createDescCont(ticket) {
    const cont = document.createElement('div');
    cont.className = 'descCont';
    cont.textContent = ticket.description;

    return cont;
  }

  createBodyBox(ticket) {
    const cont = document.createElement('div');
    cont.className = 'bodyCont';
    cont.append(this.createTextbox(ticket));
    cont.append(this.createDatebox(ticket));

    if (ticket.description !== '') {
      cont.addEventListener('click', e => {
        const tickets = document.querySelectorAll('.ticketCont');
        tickets.forEach(tick => {
          if (tick.dataset.id === ticket.id) {
            const descCont = tick.querySelector('.descCont');
            descCont.classList.toggle('descContVisible');
          }
        })
      })
    }

    return cont;
  }
}