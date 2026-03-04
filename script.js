let cart = [];
let activeItem = { name: "", price: 0 };

function loadCart() {
    const savedCart = localStorage.getItem('popeyesCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateReceiptUI();
        } catch (e) {
            console.error('Error loading cart:', e);
            cart = [];
        }
    }
}

function saveCart() {
    localStorage.setItem('popeyesCart', JSON.stringify(cart));
}

function openModal(name, price) {
    console.log('Opening modal for:', name, price);
    activeItem = { name, price };
    document.getElementById('modalItemName').innerText = name;
    document.getElementById('itemQty').value = '1';
    
    const errorEl = document.getElementById('qtyError');
    if (errorEl) {
        errorEl.style.display = 'none';
    }
    
    const modal = document.getElementById('qtyModal');
    modal.style.display = 'flex';
    console.log('Modal opened');
}

function closeModal() {
    const modal = document.getElementById('qtyModal');
    modal.style.display = 'none';
    document.getElementById('itemQty').value = '1';
    console.log('Modal closed');
}

function addToCart() {
    const qtyInput = document.getElementById('itemQty');
    const qty = parseInt(qtyInput.value);
    const errorMsg = document.getElementById('qtyError');

    if (isNaN(qty) || qty < 1) {
        errorMsg.innerText = 'Please enter a valid quantity (1-50)';
        errorMsg.style.display = 'block';
        return;
    }

    if (qty > 50) {
        errorMsg.innerText = 'Quantity cannot exceed 50 items';
        errorMsg.style.display = 'block';
        return;
    }

    cart.push({ ...activeItem, qty: qty });
    saveCart();
    updateReceiptUI();
    closeModal();
}

function updateReceiptUI() {
    const list = document.getElementById('receipt-items');
    
    if (cart.length === 0) {
        list.innerHTML = '<p class="empty-message">Your tray is empty.</p>';
        return;
    }

    list.innerHTML = "";
    cart.forEach((item, index) => {
        list.innerHTML += `
            <div class="receipt-entry">
                <span>${item.qty}x ${item.name}</span>
                <span>₱${(item.price * item.qty).toFixed(2)}</span>
                <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #d32f2f; cursor: pointer; font-weight: bold; padding: 0; font-size: 1.2rem;">✕</button>
            </div>`;
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateReceiptUI();
    document.getElementById('final-summary').style.display = 'none';
}

function computeTotal() {
    const ageInput = document.getElementById('userAge');
    const age = parseInt(ageInput.value);
    const errorMsg = document.getElementById('ageError');
    const summaryBox = document.getElementById('final-summary');

    errorMsg.style.display = 'none';

    if (isNaN(age)) {
        errorMsg.innerText = 'Please enter a valid age';
        errorMsg.style.display = 'block';
        summaryBox.style.display = 'none';
        return;
    }

    if (age < 10 || age > 100) {
        errorMsg.innerText = 'Age must be between 10 and 100 years old';
        errorMsg.style.display = 'block';
        summaryBox.style.display = 'none';
        return;
    }

    if (cart.length === 0) {
        errorMsg.innerText = 'Your cart is empty. Add items before computing total.';
        errorMsg.style.display = 'block';
        summaryBox.style.display = 'none';
        return;
    }

    let subtotal = 0;
    cart.forEach(item => subtotal += (item.price * item.qty));

    let discount = 0;
    let discountType = 'None';

    if (age >= 60) {
        discount = subtotal * 0.12;
        discountType = 'Senior Citizen (12%)';
    }

    const finalPayable = subtotal - discount;

    summaryBox.style.display = "block";
    summaryBox.innerHTML = `
        <p>Subtotal: <strong>₱${subtotal.toFixed(2)}</strong></p>
        <p>Discount (${discountType}): <span style="color:${discount > 0 ? 'red' : '#999'}">-₱${discount.toFixed(2)}</span></p>
        <hr style="margin: 10px 0;">
        <h3>Final Payable: ₱${finalPayable.toFixed(2)}</h3>
    `;
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateReceiptUI();
        document.getElementById('final-summary').style.display = 'none';
        document.getElementById('userAge').value = '';
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('qtyModal');
    if (modal && event.target === modal) {
        closeModal();
    }
}

window.addEventListener('load', loadCart);