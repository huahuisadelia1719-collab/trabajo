// script.js

// Datos de productos con imágenes
const products = [
    {
        id: 1,
        name: "Desayuno Saludable",
        price: 18.00,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Desayuno balanceado con frutas, granos integrales y proteínas."
    },
    {
        id: 2,
        name: "Ensaladas de Frutas",
        price: 24.00,
        originalPrice: 30.00,
        image: "https://images.unsplash.com/photo-1564093497595-593b96d80180?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Ensalada fresca con una variedad de frutas de temporada."
    },
    {
        id: 3,
        name: "Pérdida de Peso",
        price: 29.00,
        originalPrice: 44.00,
        image: "https://images.unsplash.com/photo-1543363136-3fdb62e11be5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Plan nutricional especializado para pérdida de peso saludable."
    },
    {
        id: 4,
        name: "El Libro de Nutrición",
        price: 19.00,
        originalPrice: 25.00,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Guía completa sobre nutrición y hábitos alimenticios saludables."
    },
    {
        id: 5,
        name: "Verduras a la Plancha",
        price: 15.00,
        originalPrice: 22.00,
        image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Selección de verduras frescas a la plancha con especias."
    },
    {
        id: 6,
        name: "Los Mejores Batidos de Proteína",
        price: 17.00,
        originalPrice: 20.00,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Batidos proteicos con ingredientes naturales y nutritivos."
    }
];

// Estado del carrito
let cart = [];
let totalPrice = 0;

// Elementos del DOM
const productsContainer = document.getElementById('products-container');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.querySelector('.cart-count');
const totalPriceElement = document.querySelector('.total-price');
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCartBtn = document.querySelector('.close-cart');
const checkoutBtn = document.querySelector('.checkout-btn');
const sortSelect = document.getElementById('sort');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    updateCart();
    
    // Event listeners
    cartIcon.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    checkoutBtn.addEventListener('click', checkout);
    sortSelect.addEventListener('change', sortProducts);
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Cerrar menú móvil al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
});

// Renderizar productos
function renderProducts(productsArray) {
    productsContainer.innerHTML = '';
    
    productsArray.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Determinar si hay descuento
        const hasDiscount = product.originalPrice !== null;
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${hasDiscount ? '<span class="product-badge">Oferta</span>' : ''}
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="current-price">S/${product.price.toFixed(2)}</span>
                    ${hasDiscount ? `<span class="original-price">S/${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    Añadir al Carrito
                </button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Añadir event listeners a los botones de carrito
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Ordenar productos
function sortProducts() {
    const sortValue = sortSelect.value;
    let sortedProducts = [...products];
    
    switch(sortValue) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default: // featured
            // Mantener el orden original
            break;
    }
    
    renderProducts(sortedProducts);
}

// Añadir producto al carrito
function addToCart(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Efecto visual de confirmación
    event.target.textContent = '¡Añadido!';
    event.target.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
        event.target.textContent = 'Añadir al Carrito';
        event.target.style.backgroundColor = '';
    }, 1000);
}

// Actualizar carrito
function updateCart() {
    // Actualizar contador
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Actualizar items del carrito
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        totalPrice = 0;
    } else {
        totalPrice = 0;
        
        cart.forEach(item => {
            totalPrice += item.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">S/${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Añadir event listeners a los botones
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }
    
    // Actualizar precio total
    totalPriceElement.textContent = `S/${totalPrice.toFixed(2)}`;
}

// Disminuir cantidad de un producto en el carrito
function decreaseQuantity(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        updateCart();
    } else if (item && item.quantity === 1) {
        // Si la cantidad es 1, eliminar el producto
        removeFromCart(event);
    }
}

// Aumentar cantidad de un producto en el carrito
function increaseQuantity(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += 1;
        updateCart();
    }
}

// Eliminar producto del carrito
function removeFromCart(event) {
    const productId = parseInt(event.currentTarget.getAttribute('data-id'));
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        updateCart();
    }
}

// Alternar visibilidad del carrito
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : 'auto';
}

// Finalizar compra
function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Añade productos antes de finalizar la compra.');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Crear resumen de compra
    let summary = "¡Gracias por tu compra!\n\nResumen de tu pedido:\n";
    cart.forEach(item => {
        summary += `• ${item.name} - ${item.quantity} x S/${item.price.toFixed(2)} = S/${(item.price * item.quantity).toFixed(2)}\n`;
    });
    summary += `\nTotal: S/${total.toFixed(2)}\n\nPronto serás redirigido al pago.`;
    
    alert(summary);
    
    // Vaciar carrito
    cart = [];
    updateCart();
    toggleCart();
}

// Alternar menú móvil
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}