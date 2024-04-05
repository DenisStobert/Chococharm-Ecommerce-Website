let cart = [];
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');
window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');
        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });
};
document.addEventListener('DOMContentLoaded', () => {
    const cartButtons = document.querySelectorAll('.cart-btn');
    const cartIcon = document.querySelector('.cart-icon');

    cartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default anchor action

            // Increment the cart count
            let count = parseInt(cartIcon.getAttribute('data-count') || '0');
            cartIcon.setAttribute('data-count', count + 1);

            // Add a class to change the icon style (optional)
            cartIcon.classList.add('filled');
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const toggler = document.getElementById('toggler');
    const navbarItems = document.querySelectorAll('header .navbar a'); // Select all anchor tags inside the navbar

    // Add a click event listener to each navbar item
    navbarItems.forEach(item => {
        item.addEventListener('click', () => {
            toggler.checked = false; // Uncheck the toggler to close the navbar
        });
    });

    // Your existing code for the wishlist and cart icons, toggler, and overlay...
});
document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.cart-icon');
    const cartBox = document.getElementById('cartBox');
    const overlay = document.getElementById('overlay');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    let totalQuantity = 0; // To track the total number of items

    // Load cart items from local storage
    const savedCartItems = getCartItems();
    savedCartItems.forEach(item => {
        // Add each item to the UI and multiply by quantity for the total
        for (let i = 0; i < item.quantity; i++) {
            addToCartUI(item.name, item.price, item.image);
        }
        // Update total price and total quantity
        totalQuantity += item.quantity;
    });

    // Set the cart icon count based on the total quantity of items
    cartIcon.setAttribute('data-count', totalQuantity);
    if (totalQuantity > 0) {
        cartIcon.classList.add('filled');
    }

    // Load the total price from local storage
    const savedTotal = localStorage.getItem('cartTotal');
    if (savedTotal) {
        cartTotal.textContent = savedTotal;
    }

    cartIcon.addEventListener('click', (event) => {
        event.preventDefault();
        const isCartBoxOpen = cartBox.classList.contains('centered');
        if (isCartBoxOpen) {
            cartBox.classList.remove('centered');
            overlay.classList.remove('show');
        } else {
            cartBox.classList.add('centered');
            overlay.classList.add('show');
        }
    });

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            cartBox.classList.remove('centered');
            overlay.classList.remove('show');
        }
    });

    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
    
            const itemName = button.getAttribute('data-name');
            const itemPrice = parseInt(button.getAttribute('data-price'), 10);
            const itemImage = button.getAttribute('data-image');
    
            addToCartUI(itemName, itemPrice, itemImage);
    
            total += itemPrice;
            cartTotal.textContent = total;
    
            let count = parseInt(cartIcon.getAttribute('data-count') || '0');
            cartIcon.setAttribute('data-count', count + 1);
    
            updateCart();
        });
    });

    const payCartButton = document.getElementById('payCart');
    payCartButton.addEventListener('click', () => {
        window.location.href = 'pay.html';
    });

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('increase') || event.target.classList.contains('decrease')) {
            const itemName = event.target.getAttribute('data-name');
            let cartItem = cartItemsContainer.querySelector(`.cart-item[data-name="${itemName}"]`);
            let quantityElement = cartItem.querySelector('.quantity-value');
            let newQuantity = event.target.classList.contains('increase') ? parseInt(quantityElement.textContent) + 1 : parseInt(quantityElement.textContent) - 1;
            
            if (newQuantity > 0) {
                quantityElement.textContent = newQuantity;
                // Add animation class based on increase or decrease
                if (event.target.classList.contains('increase')) {
                    quantityElement.classList.add('animate-grow');
                    setTimeout(() => quantityElement.classList.remove('animate-grow'), 300); // Remove the class after animation
                } else {
                    quantityElement.classList.add('animate-shrink');
                    setTimeout(() => quantityElement.classList.remove('animate-shrink'), 300); // Remove the class after animation
                }
            } else {
                cartItem.remove();
            }
    
            updateCartIconCount(); // Update the cart icon count after quantity changes
            updateCartTotal(); // Update the total price after quantity changes
            updateCart(); // Save the updated cart to local storage
        }
    });
    function updateCartTotal() {
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
        });
        cartTotal.textContent = total;
        localStorage.setItem('cartTotal', total.toString()); // Update the total price in local storage
    }
    function updateCartIconCount() {
        let totalItems = 0;
        const cartItems = Array.from(document.querySelectorAll('.cart-item'));
        cartItems.forEach(item => {
            totalItems += parseInt(item.querySelector('.quantity-value').textContent);
        });
        cartIcon.setAttribute('data-count', totalItems);
        if (totalItems > 0) {
            cartIcon.classList.add('filled');
        } else {
            cartIcon.classList.remove('filled');
        }
    }

    function addToCartUI(itemName, itemPrice, itemImage) {
        // Check if the item already exists in the cart
        let existingItem = cart.find(item => item.name === itemName);
        if (existingItem) {
            // If the item exists, increase the quantity
            existingItem.quantity++;
        } else {
            // If the item does not exist, add it as a new entry to the cart array
            cart.push({ name: itemName, price: itemPrice, image: itemImage, quantity: 1 });
        }
        updateCartUI(); // Update the cart UI
        updateCart(); // Save the updated cart
    }
    function getCartItems() {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }
    function updateCartUI() {
        cartItemsContainer.innerHTML = ''; // Clear the existing cart items
        cart.forEach(item => {
            // Add each item to the UI
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.setAttribute('data-name', item.name);
            cartItem.innerHTML = `
                <img src="${item.image}" alt="Product Image" class="cart-item-image">
                <div class="cart-item-details">
                    <span class="cart-item-name" title="${item.name}">${item.name}</span>
                    <span class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-name="${item.name}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase" data-name="${item.name}">+</button>
                    </span>
                    <span class="cart-item-price">${item.price}₸/штука</span>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        updateCartTotal(); // Update the total price
    }
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart)); // Save the cart array to local storage
        updateCartIconCount(); // Update the cart icon count
    }
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.content');
hiddenElements.forEach(el => observer.observe(el));

document.addEventListener('DOMContentLoaded', () => {
    const shareButtons = document.querySelectorAll('.share-btn');

    shareButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();

            // Close any other open share boxes
            document.querySelectorAll('.share-box.show').forEach(box => {
                if (box !== event.target.closest('.box').querySelector('.share-box')) {
                    box.classList.remove('show');
                }
            });

            // Toggle the current share box
            const shareBox = event.target.closest('.box').querySelector('.share-box');
            shareBox.classList.toggle('show');
        });
    });

    // Close the share box when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.classList.contains('share-btn') && !event.target.closest('.share-box')) {
            document.querySelectorAll('.share-box').forEach(box => {
                box.classList.remove('show');
            });
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const phoneModal = document.getElementById('phoneModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmationText = document.getElementById('confirmationText');
    const closeModal = document.getElementById('closeModal');
    const submitPhoneNumber = document.getElementById('submitPhoneNumber');
    const phoneNumberInput = document.getElementById('phoneNumberInput');
    const placeOrderButton = document.getElementById('placeOrder'); // Add this line

    // Initialize EmailJS with your user ID
    emailjs.init('1COGcobGDzUIbib8x');

    // Add event listener to the placeOrder button
    placeOrderButton.addEventListener('click', () => {
        phoneModal.style.display = 'flex';
    });
    submitPhoneNumber.addEventListener('click', () => {
        const customerName = document.getElementById('customerNameInput').value;

        if (phoneNumberInput.validity.valid) {
            // Prepare the template parameters
            const orderDetailsString = cart.map(item => `Name: ${item.name}, Quantity: ${item.quantity}`).join('<br>');
    
            const templateParams = {
                customerName: customerName,
                customerPhone: `+7${phoneNumberInput.value}`,
                orderDetails: orderDetailsString,
                totalCost: cart.reduce((total, item) => total + item.price * item.quantity, 0)
            };
    
            // Send the email
            emailjs.send('service_i4jsypi', 'template_aj5mb9p', templateParams)
                .then(response => {
                    console.log('Phone number sent successfully', response);
                    confirmationText.innerHTML = '<i class="fas fa-check-circle" style="color: green;"></i><span>Ваш заказ был оформлен. Ожидайте звонка!</span>';
                    confirmationText.style.color = 'green'; // Set text color to green for success
                    confirmationModal.style.display = 'flex'; // Show the confirmation modal
    
                    // Hide the confirmation modal after a delay
                    setTimeout(() => {
                        confirmationModal.style.display = 'none';
                    }, 5000); // Adjust the delay as needed
                }, error => {
                    console.error('Error sending phone number', error);
                    confirmationText.innerHTML = '<i class="fas fa-times-circle" style="color: red;"></i><span>Ошибка при отправке заказа. Пожалуйста, попробуйте снова.</span>';
                    confirmationText.style.color = 'red'; // Set text color to red for error
                    confirmationModal.style.display = 'flex'; // Show the confirmation modal
    
                    // Hide the confirmation modal after a delay
                    setTimeout(() => {
                        confirmationModal.style.display = 'none';
                    }, 2000); // Adjust the delay as needed
                });
        } else {
            confirmationText.innerHTML = '<i class="fas fa-times-circle" style="color: red;"></i><span>Пожалуйста, введите действительный номер телефона.</span>';
            confirmationText.style.color = 'red'; // Set text color to red for validation error
            confirmationModal.style.display = 'flex'; // Show the confirmation modal
    
            // Prevent clicking on other elements while the modal is displayed
            document.body.classList.add('disable-pointer-events');
    
            // Hide the confirmation modal after a delay and reopen the phone modal
            setTimeout(() => {
                confirmationModal.style.display = 'none';
                phoneModal.style.display = 'flex';
                document.body.classList.remove('disable-pointer-events'); // Re-enable clicking on other elements
            }, 2000); // Adjust the delay as needed
        }
    });

    closeModal.addEventListener('click', () => {
        phoneModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === phoneModal || event.target === confirmationModal) {
            phoneModal.style.display = 'none';
            confirmationModal.style.display = 'none';
        }
    });
});