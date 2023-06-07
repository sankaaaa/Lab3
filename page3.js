document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('addButton');
    const firstLineInput = document.getElementById('firstLineInput');
    const productList = document.getElementById('rect1');
    const productList2 = document.querySelector('.rectangle2 .secondLine');
    const defaultProducts = ['Сир', 'Печиво', 'Помідори'];
    const addedProducts = [];

    addButton.addEventListener('click', function() {
        const productName = firstLineInput.value;

        if (productName !== '') {
            if (addedProducts.includes(productName) || defaultProducts.includes(productName)) {
                alert('Цей товар вже є у списку покупок.');
                return;
            }

            const newItem = document.createElement('section');
            newItem.classList.add('line');
            newItem.innerHTML = `
          <div class="left">
            <input type="text" value="${productName}">
          </div>
          <div class="center">
            <button class="buttonM" data-tooltip="мінус" disabled>-</button>
            <label class="amount">1</label>
            <button class="buttonP" data-tooltip="плюс">+</button>
          </div>
          <div class="right">
            <button class="buttonBought" data-tooltip="куплено">Куплено</button>
            <button class="buttonCancel" data-tooltip="скасувати">×</button>
          </div>`;

            productList.appendChild(newItem);

            const hr = document.createElement('hr');
            hr.classList.add('line-hr');
            productList.appendChild(hr);

            firstLineInput.value = '';
            firstLineInput.focus();

            const newItem2 = document.createElement('label');
            newItem2.classList.add('product');
            newItem2.innerHTML = `${productName}<span class="amount">1</span>`;
            productList2.appendChild(newItem2);

            addedProducts.push(productName);
        }
    });

    const container = document.querySelector('.container');
    container.addEventListener('click', function(event) {
        if (event.target.classList.contains('buttonCancel')) {
            const section = event.target.parentNode.parentNode;
            const nextSibling = section.nextElementSibling;
            const productName = section.querySelector('.left input').value;

            section.remove();
            if (nextSibling) {
                nextSibling.parentNode.removeChild(nextSibling);
            }

            const products = productList2.querySelectorAll('.product');
            products.forEach(function(product) {
                const productText = product.textContent;
                if (productText.includes(productName)) {
                    productList2.removeChild(product);
                }
            });

            const productIndex = addedProducts.indexOf(productName);
            if (productIndex > -1) {
                addedProducts.splice(productIndex, 1);
            }
        } else if (event.target.classList.contains('buttonP')) {
            const amountLabel = event.target.parentNode.querySelector('.amount');
            const product = event.target.parentNode.parentNode.querySelector('.left input').value;
            let amount = parseInt(amountLabel.textContent);
            amount++;
            amountLabel.textContent = amount.toString();

            const minusButton = event.target.parentNode.querySelector('.buttonM');
            minusButton.disabled = false;

            const products = productList2.querySelectorAll('.product');
            products.forEach(function(productElement) {
                if (productElement.textContent.includes(product)) {
                    const productAmount = productElement.querySelector('.amount');
                    productAmount.textContent = amount.toString();
                }
            });
        } else if (event.target.classList.contains('buttonM')) {
            const amountLabel = event.target.parentNode.querySelector('.amount');
            const product = event.target.parentNode.parentNode.querySelector('.left input').value;
            let amount = parseInt(amountLabel.textContent);
            if (amount > 1) {
                amount--;
                amountLabel.textContent = amount.toString();

                const products = productList2.querySelectorAll('.product');
                products.forEach(function(productElement) {
                    if (productElement.textContent.includes(product)) {
                        const productAmount = productElement.querySelector('.amount');
                        productAmount.textContent = amount.toString();
                    }
                });
            } else {
                event.target.disabled = true;
            }
        } else if (event.target.classList.contains('line')) {
            const section = event.target;
            const productName = section.querySelector('input[type="text"]');

            // Замінюємо назву товару на поле вводу
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.value = productName.value;
            section.replaceChild(inputField, productName);
            inputField.focus();

            // Відслідковуємо зміну фокусу на полі вводу
            inputField.addEventListener('blur', function() {
                // Замінюємо поле вводу на відредаговану назву
                const editedProductName = document.createElement('span');
                editedProductName.textContent = inputField.value;
                section.replaceChild(editedProductName, inputField);

                // Оновлюємо назву товару у відповідному продукті в правому прямокутнику
                const products = productList2.querySelectorAll('.product');
                products.forEach(function(productElement) {
                    const productText = productElement.textContent;
                    if (productText.includes(productName.value)) {
                        productElement.textContent = productText.replace(productName.value, inputField.value);
                    }
                });
            });
        }
    });

    document.addEventListener('click', function(event) {
        const parentSection = event.target.closest('section');
        const productName = parentSection.querySelector('.left input');
        const buttonPlus = parentSection.querySelector('.buttonP');
        const buttonMinus = parentSection.querySelector('.buttonM');
        const buttonCancel = parentSection.querySelector('.buttonCancel');
        const buttonBought = parentSection.querySelector('.buttonBought');

        if (event.target.classList.contains('buttonBought')) {
            productName.style.textDecoration = 'line-through';
            buttonPlus.style.visibility = 'hidden';
            buttonMinus.style.visibility = 'hidden';
            buttonCancel.style.display = 'none';
            buttonBought.style.display = 'none';

            const buttonNotBought = document.createElement('button');
            buttonNotBought.className = 'buttonNotBought';
            buttonNotBought.setAttribute('data-tooltip', 'Не куплено');
            buttonNotBought.textContent = 'Не куплено';

            buttonNotBought.addEventListener('click', function() {
                productName.style.textDecoration = 'none';
                buttonPlus.style.visibility = 'visible';
                buttonMinus.style.visibility = 'visible';
                buttonCancel.style.display = 'inline';
                buttonBought.style.display = 'inline';
                buttonNotBought.style.display = 'none';
                const amountLabel = parentSection.querySelector('.amount');
                const amount = parseInt(amountLabel.textContent);

                const productList2SecondLine = document.querySelector('.rectangle2 .secondLine');
                const newItem = document.createElement('label');
                newItem.classList.add('product');
                newItem.innerHTML = `${productName.value}<span class="amount">${amount}</span>`;
                productList2SecondLine.appendChild(newItem);

                // Видалення товару з четвертого рядка другого прямокутника
                const productList2FourthLine = document.querySelector('.rectangle2 .fourthLine');
                const products = productList2FourthLine.querySelectorAll('.product');
                products.forEach(function(product) {
                    if (product.textContent.includes(productName.value)) {
                        productList2FourthLine.removeChild(product);
                    }
                });
            });

            const rightDiv = parentSection.querySelector('.right');
            rightDiv.appendChild(buttonNotBought);

            const amountLabel = parentSection.querySelector('.amount');
            const amount = parseInt(amountLabel.textContent);

            const productList2 = document.querySelector('.rectangle2 .fourthLine');
            const newItem = document.createElement('label');
            newItem.classList.add('product');
            newItem.innerHTML = `${productName.value}<span class="amount">${amount}</span>`;
            productList2.appendChild(newItem);

            // Видалення товару з другого рядка другого прямокутника
            const productList2SecondLine = document.querySelector('.rectangle2 .secondLine');
            const products = productList2SecondLine.querySelectorAll('.product');
            products.forEach(function(product) {
                if (product.textContent.includes(productName.value)) {
                    productList2SecondLine.removeChild(product);
                }
            });
        }
    });

    document.addEventListener('input', function(event) {
        const input = event.target;
        const section = input.closest('.line');
        const productName = input.value;

        const products = productList2.querySelectorAll('.product');
        products.forEach(function(productElement) {
            const productText = productElement.textContent;
            if (productText.includes(productName)) {
                const productLabel = productElement.querySelector('.amount');
                productLabel.textContent = section.querySelector('.amount').textContent;
            }
        });
    });

});
