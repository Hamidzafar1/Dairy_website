// Mobile Navigation
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('nav a');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Cart functionality
let cart = [];

document.addEventListener('DOMContentLoaded', function() {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Cart open/close
    const cartIcon = document.getElementById('cartIcon');
    const closeCart = document.getElementById('closeCart');
    const cartContainer = document.getElementById('cartContainer');
    
    cartIcon.addEventListener('click', function() {
        cartContainer.classList.add('open');
    });
    
    closeCart.addEventListener('click', function() {
        cartContainer.classList.remove('open');
    });
    
    // Phone number validation
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        // Remove any non-digit characters as they're typed
        let cleaned = e.target.value.replace(/\D/g, '');
        e.target.value = cleaned;
        
        // Add visual feedback
        if (cleaned.length > 0 && cleaned.length < 11) {
            phoneInput.style.borderColor = '#e74c3c';
        } else if (cleaned.length >= 11) {
            phoneInput.style.borderColor = '#4a7c59';
        } else {
            phoneInput.style.borderColor = '#ddd';
        }
    });
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.addEventListener('click', checkout);
    
    // Load cart from localStorage if available
    if (localStorage.getItem('dairyCart')) {
        cart = JSON.parse(localStorage.getItem('dairyCart'));
        updateCartDisplay();
    }
});

function showPopup(message) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    
    // Reset animation by removing and re-adding the element
    const oldProgress = popup.querySelector('.popup-progress');
    if (oldProgress) {
        oldProgress.remove();
    }
    const newProgress = document.createElement('div');
    newProgress.className = 'popup-progress';
    popup.appendChild(newProgress);
    
    popupMessage.textContent = message;
    popup.classList.add('show');
    
    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000);
}

function showModal(message) {
    const modal = document.getElementById('checkoutModal');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('checkoutModal');
    modal.classList.remove('show');
}

function addToCart(event) {
    const button = event.target;
    const id = button.dataset.id;
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const image = button.dataset.image;
    
    // Check if item is already in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showPopup(`Added another ${name} to your cart`);
    } else {
        cart.push({
            id,
            name,
            price,
            image,
            quantity: 1
        });
        showPopup(`${name} has been added to your cart`);
    }
    
    // Save cart to localStorage
    localStorage.setItem('dairyCart', JSON.stringify(cart));
    
    // Update cart display
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    // Clear current cart display
    cartItems.innerHTML = '';
    
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // If cart is empty
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = 'Rs.0';
        return;
    }
    
    // Add items to cart display
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-image" style="background-image: url('${item.image}');"></div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">Rs.${item.price}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}">×</button>
        `;
        
        cartItems.appendChild(cartItemElement);
    });
    
    // Update total
    cartTotal.textContent = `Rs.${total}`;
    
    // Add event listeners to quantity buttons and remove buttons
    const decreaseButtons = document.querySelectorAll('.decrease');
    const increaseButtons = document.querySelectorAll('.increase');
    const removeButtons = document.querySelectorAll('.remove-item');
    
    decreaseButtons.forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    increaseButtons.forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    removeButtons.forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

function decreaseQuantity(event) {
    const id = event.target.dataset.id;
    const item = cart.find(item => item.id === id);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        // Remove item if quantity becomes 0
        cart = cart.filter(item => item.id !== id);
    }
    
    // Save cart to localStorage
    localStorage.setItem('dairyCart', JSON.stringify(cart));
    
    // Update cart display
    updateCartDisplay();
}

function increaseQuantity(event) {
    const id = event.target.dataset.id;
    const item = cart.find(item => item.id === id);
    
    item.quantity += 1;
    
    // Save cart to localStorage
    localStorage.setItem('dairyCart', JSON.stringify(cart));
    
    // Update cart display
    updateCartDisplay();
}

function removeItem(event) {
    const id = event.target.dataset.id;
    cart = cart.filter(item => item.id !== id);
    
    // Save cart to localStorage
    localStorage.setItem('dairyCart', JSON.stringify(cart));
    
    // Update cart display
    updateCartDisplay();
}

function validatePhoneNumber(phone) {
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 11;
}

function checkout() {
    if (cart.length === 0) {
        showPopup('Your cart is empty!');
        return;
    }

    // Get customer information
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const email = document.getElementById('email').value.trim();

    // Validate required fields
    if (!phone || !address) {
        showPopup('Please fill in required delivery information!');
        return;
    }

    // Validate phone number length
    if (!validatePhoneNumber(phone)) {
        showPopup('Please enter a valid phone number (at least 11 digits)');
        document.getElementById('phone').focus();
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order summary
    const orderSummary = cart.map(item => 
        `${item.name} x${item.quantity} - Rs.${item.price * item.quantity}`
    ).join('\n');
    
    const message = `Thank you for your order!\n\nDelivery Details:\nPhone: ${phone}\nAddress: ${address}${email ? '\nEmail: ' + email : ''}\n\nOrder Summary:\n${orderSummary}\n\nTotal: Rs.${total}`;
    
    showModal(message);
    
    // Clear cart
    cart = [];
    localStorage.removeItem('dairyCart');
    updateCartDisplay();
    
    // Close cart sidebar
    document.getElementById('cartContainer').classList.remove('open');
} 