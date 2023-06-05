
    const addButton = document.getElementById('button');
    const firstLineInput = document.getElementById('firstLineInput');
    const productList = document.getElementById('rect1');

    addButton.addEventListener('click', function() {
        const productName = firstLineInput.value;

        if (productName !== '') {
            const newItem = document.createElement('section');
            newItem.classList.add('line');

            newItem.innerHTML = `
        <div class="left">
          <input type="text" value="${productName}">
        </div>
        <div class="center">
          <button class="button-" data-tooltip="мінус">-</button>
          <label class="amount">3</label>
          <button class="button+" data-tooltip="плюс">+</button>
        </div>
        <div class="right">
          <button class="buttonBought" data-tooltip="куплено">Куплено</button>
          <button class="buttonCancel" data-tooltip="скасувати">×</button>
        </div>
      `;

            productList.appendChild(newItem);
            //розмежування
            const hr = document.createElement('hr');
            hr.classList.add('line-hr');
            productList.appendChild(hr);

            firstLineInput.value = '';
            firstLineInput.focus();//курсор
        }
    });
