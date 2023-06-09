document.addEventListener('DOMContentLoaded', function() {
addProduct();
deleteProduct();
buyProduct();
changeName();
});


const productList = document.getElementById('rect1');
const firstLineInput = document.getElementById('firstLineInput');
const addButton = document.getElementById('addButton');
const productList2 = document.querySelector('.rectangle2 .secondLine');
const container = document.querySelector('.container');
const defaultProducts = ['Сир', 'Печиво', 'Помідори'];
const addedProducts = [];
function addProduct() {
    addButton.addEventListener('click', function () {
        const productName = firstLineInput.value;
        if (productName !== "") {
            if (addedProducts.includes(productName) || defaultProducts.includes(productName)) {
                alert('Цей товар вже є у списку покупок.');
                return;
            }
            //створити новий елемент (рядок з продуктом в першому прямокутнику і лінію)
            const newItem = document.createElement('section');
            const hr = document.createElement('hr');
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
            hr.classList.add('line-hr');
            productList.appendChild(hr);

            firstLineInput.value = '';
            firstLineInput.focus();

            //додати новостворений елемент в другий прямокутник
            const newItem2 = document.createElement('label');
            newItem2.classList.add('product');
            newItem2.innerHTML = `${productName}<span class="amount">1</span>`;
            productList2.appendChild(newItem2);

            addedProducts.push(productName);
        }
    });
}
function deleteProduct() {
    container.addEventListener('click', function (event) {
        const amountLabel = event.target.parentNode.querySelector('.amount');
        const product = event.target.parentNode.parentNode.querySelector('.left input').value;
        if (event.target.classList.contains('buttonCancel')) {
            //видалити рядок з продуктом з лівого прямокутника при натисканні кенсіл
            const section = event.target.parentNode.parentNode;
            const nextSibling = section.nextElementSibling;
            const productName = section.querySelector('.left input').value;

            section.remove();
            if (nextSibling) {
                nextSibling.parentNode.removeChild(nextSibling);
            }

            //видалити продукт з правого прямокутника
            const products = productList2.querySelectorAll('.product');
            products.forEach(function (product) {
                const productText = product.textContent;
                if (productText.includes(productName)) {
                    productList2.removeChild(product);
                }
            });

            //видалити продукт з масиву доданих продуктів
            const productIndex = addedProducts.indexOf(productName);
            if (productIndex > -1) {
                addedProducts.splice(productIndex, 1);
            }
            //видалити продукт з масиву дефолтних продуктів
            const defaultProductIndex = defaultProducts.indexOf(productName);
            if (defaultProductIndex > -1) {
                defaultProducts.splice(defaultProductIndex, 1);
            }
        }else if (event.target.classList.contains('buttonP')) {
            //додавати кількість продукту в леблі між кнопками + і -
            let amount = parseInt(amountLabel.textContent);
            amount++;
            amountLabel.textContent = amount.toString();
            const minusButton = event.target.parentNode.querySelector('.buttonM');
            minusButton.disabled = false;

            //додавати кількість продукту в леблі другого рядка правого прямокутника
            const products = productList2.querySelectorAll('.product');
            products.forEach(function(productElement) {
                if (productElement.textContent.includes(product)) {
                    const productAmount = productElement.querySelector('.amount');
                    productAmount.textContent = amount.toString();
                }
            });
        }else if(event.target.classList.contains('buttonM')) {
            let amount = parseInt(amountLabel.textContent);
            if (amount > 1) {
                amount--;
                amountLabel.textContent = amount.toString();

                const products = productList2.querySelectorAll('.product');
                products.forEach(function (productElement) {
                    if (productElement.textContent.includes(product)) {
                        const productAmount = productElement.querySelector('.amount');
                        productAmount.textContent = amount.toString();
                    }
                });
            }
        }
    });
}

function buyProduct(){
    document.addEventListener('click', function(event) {
        const parentSection = event.target.closest('section');
        const productName = parentSection.querySelector('.left input');
        const buttonPlus = parentSection.querySelector('.buttonP');
        const buttonMinus = parentSection.querySelector('.buttonM');
        const buttonCancel = parentSection.querySelector('.buttonCancel');
        const buttonBought = parentSection.querySelector('.buttonBought');
        //події при натисканні на кнопку куплено
        if (event.target.classList.contains('buttonBought')) {
            productName.style.textDecoration = 'line-through';
            buttonPlus.style.visibility = 'hidden';
            buttonMinus.style.visibility = 'hidden';
            buttonCancel.style.display = 'none';
            buttonBought.style.display = 'none';

            //створення нової кнопки не куплено
            const buttonNotBought = document.createElement('button');
            buttonNotBought.className = 'buttonNotBought';
            buttonNotBought.setAttribute('data-tooltip', 'Не куплено');
            buttonNotBought.textContent = 'Не куплено';

            //події для кнопки не куплено
            buttonNotBought.addEventListener('click', function() {
                productName.style.textDecoration = 'none';
                buttonPlus.style.visibility = 'visible';
                buttonMinus.style.visibility = 'visible';
                buttonCancel.style.display = 'inline';
                buttonBought.style.display = 'inline';
                buttonNotBought.style.display = 'none';
                const amountLabel = parentSection.querySelector('.amount');
                const amount = parseInt(amountLabel.textContent);

                //додавання продукту назад в другий рядок другого прямокутника
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
            //додавання кнопки не куплено вправу частину діва
            const rightDiv = parentSection.querySelector('.right');
            rightDiv.appendChild(buttonNotBought);

            //додавання перекресленого продукта в четвертий рядок другого прямокутника
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
}
function changeName() {
    container.addEventListener('input', function(event) {
        const section = event.target.closest('section');
        const productName = section.querySelector('.left input').value;
        const productList2SecondLine = document.querySelector('.rectangle2 .secondLine');
        const products = productList2SecondLine.querySelectorAll('.product');

        products.forEach(function(product) {
            const productText = product.textContent.trim();

            if (productText.includes(productName)) {
                const amount = product.querySelector('.amount').textContent.trim();
                product.innerHTML = productName + ' <span class="amount">' + amount + '</span>';
            }
        });
    });
}





