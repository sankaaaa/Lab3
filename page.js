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
        addNewProduct();
    });

    firstLineInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            addNewProduct();
        }
    });

    function addNewProduct() {
        const productName = firstLineInput.value;
        if (productName !== '') {
            const formattedProductName =
                productName.charAt(0).toUpperCase() + productName.slice(1);
            if (
                addedProducts.includes(formattedProductName) ||
                defaultProducts.includes(formattedProductName)
            ) {
                alert('Цей товар вже є у списку покупок.');
                return;
            }
            // Створити новий елемент (рядок з продуктом в першому прямокутнику і лінію)
            const newItem = document.createElement('section');
            const hr = document.createElement('hr');
            newItem.classList.add('line');
            newItem.innerHTML = `
        <div class="left">
          <input id="${formattedProductName.value + 'NewInput'}" type="text" onclick="changeName(id, event)" value="${formattedProductName}">
        </div>
        <div class="center">
          <button class="buttonM" data-tooltip="мінус" disabled style="background-color: #F75D59; text-shadow: 1px 1px 1px red;">-</button>
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

            // Додати новостворений елемент в другий прямокутник
            const newItem2 = document.createElement('label');
            newItem2.classList.add('product');
            newItem2.innerHTML = `<label>${formattedProductName}</label><span class="amount">1</span>`;
            productList2.appendChild(newItem2);

            addedProducts.push(formattedProductName);
        }
    }
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
            if (amount > 1) {
                minusButton.style.backgroundColor = 'red';
                minusButton.style.textShadow = '1px 1px 1px darkred';
            } else {
                // Повернути оригінальний колір
                minusButton.style.backgroundColor = '';
                minusButton.style.textShadow = '';
            }
        }else if (event.target.classList.contains('buttonM')) {
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

            if (amount === 1) {
                event.target.style.backgroundColor = '#F75D59';
                event.target.style.textShadow = '1px 1px 1px #E55451';
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
function changeName(idName, event) {
    const input = document.getElementById(idName);
    const oldName = input.value;

    input.addEventListener('keyup', function (event) {
        if (event.key === "Enter") {
            newProductName(input, oldName);
        }
    });

    input.addEventListener('input', function (event) {
        if (input.value.trim() === "") {
            input.value = oldName; // Restore the previous name if the input becomes empty
            alert("Product name cannot be empty!");
        }
    });

    input.addEventListener('blur', function (event) {
        newProductName(input, oldName);
    });
}

function newProductName(input, oldName) {
    const newName = input.value;

    const rightPanel = document.querySelector('.rectangle2 .secondLine');
    for (const rightPanelElement of rightPanel.children) {
        if (rightPanelElement.firstElementChild.textContent === oldName) {
            rightPanelElement.firstElementChild.textContent = newName;
        }
    }
}











