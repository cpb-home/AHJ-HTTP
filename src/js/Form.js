import TicketService from "./TicketService";

export default class Form {
  constructor (type, initCallBack, id) {
    this.type = type;
    this.id = id || null;
    this.initCallBack = initCallBack;
  }

  create() {
    const form = document.createElement('form');
    form.classList = 'form';

    const header = document.createElement('h3');
    
    switch (this.type) {
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
        form.append(this.createInput('text', 'Краткое описание', 'shortTextInp'));
        form.append(this.createLongLabel());
        form.append(this.createTextarea('Подробное описание', 'longTextInp'));
        form.append(this.createBtnsCont());
        break;
      case 'add':
        header.textContent = 'Добавить тикет';
        form.append(header);

        form.append(this.createShortLabel());
        form.append(this.createInput('text', 'Введите краткое описание', 'shortTextInp'));
        form.append(this.createLongLabel());
        form.append(this.createTextarea('Введите подробное описание', 'longTextInp'));
        form.append(this.createBtnsCont());
        break;
      default:
        header.textContent = 'Ошибка: что-то пошло не так!';
        form.append(header);
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(e.target);

      if (this.type === 'delete') {
        TicketService.delete(this.id, (res) => {
          if (res.status === 204) {
            const popup = document.querySelector('.popupCont');
            popup.textContent = '';
            popup.style.display = 'none';
            
          }
        });
      }

      if (this.type === 'add') {
        TicketService.create(data, (res) => {
          if (res.status === 200) {
            const popup = document.querySelector('.popupCont');
            popup.textContent = '';
            popup.style.display = 'none';
            
          }
        });
      }
    })
    return form;
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

  createTextarea(holder, name) {
    const area = document.createElement('textarea');
    area.classList = 'field ' + name;
    area.id = name;
    area.name = name;
    area.required = true;
    area.placeholder = holder;
    if (this.type === 'edit') {
      TicketService.get(this.id, (ticket) => {
        area.value = ticket.description || '';
      });
    }
    return area;
  }

  createInput(type, holder, name) {
    const input = document.createElement('input');
    input.classList = 'field shortTextInp';
    input.id = 'shortTextInp';
    input.type = 'text';
    input.name = 'shortTextInp';
    input.required = true;
    input.placeholder = 'Введите краткое описание';

    if (this.type === 'edit') {
      TicketService.get(this.id, (ticket) => {
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
}