// INITIAL DUMMY PRODUCTS DATA
const initialProducts = [
    {
        id: "p1",
        name: "iPhone 15 Pro Max 256GB",
        category: "Phone",
        price: 29990000,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
        description: "Điện thoại thông minh cao cấp với khung Titanium, chip A17 Pro siêu mạnh mẽ và camera zoom quang 5x.",
        specs: ["Màn hình 6.7 inch OLED 120Hz", "Chip Apple A17 Pro", "RAM 8GB / 256GB Storage", "Pin 4422 mAh"]
    },
    {
        id: "p2",
        name: "MacBook Pro 14 M3 Chip",
        category: "Laptop",
        price: 39990000,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
        description: "Laptop hiệu năng đỉnh cao dành cho lập trình viên và nhà thiết kế với màn hình Liquid Retina XDR rực rỡ.",
        specs: ["Apple M3 8-core CPU", "RAM 18GB Unified", "SSD 512GB High Speed", "Màn hình 14.2 inch Mini-LED"]
    },
    {
        id: "p3",
        name: "Sony WH-1000XM5",
        category: "Audio",
        price: 7990000,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        description: "Tai nghe chụp tai chống ồn hàng đầu thế giới với thời lượng pin 30 giờ và âm thanh đỉnh cao.",
        specs: ["Chống ồn chủ động ANC", "Pin 30 giờ", "Sạc nhanh 3 phút dùng 3 giờ", "Micro khử tiếng ồn AI"]
    },
    {
        id: "p4",
        name: "Apple Watch Series 9",
        category: "Accessory",
        price: 9890000,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
        description: "Đồng hồ thông minh hỗ trợ theo dõi sức khỏe toàn diện, tính năng Double Tap độc đáo.",
        specs: ["Màn hình Always-On OLED", "Đo nhịp tim, SpO2, Điện tâm đồ", "Chống nước 50m", "S9 SiP Chip"]
    },
    {
        id: "p5",
        name: "Samsung Galaxy S24 Ultra",
        category: "Phone",
        price: 27990000,
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
        description: "Quyền năng Galaxy AI đỉnh cao, bút S-Pen tích hợp, khung vỏ Titan bền bỉ.",
        specs: ["Snapdragon 8 Gen 3 for Galaxy", "Màn hình 6.8 inch QHD+ 120Hz", "Camera 200MP", "Pin 5000 mAh"]
    },
    {
        id: "p6",
        name: "Bàn phím cơ Keychron K2 Pro",
        category: "Accessory",
        price: 2190000,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
        description: "Bàn phím cơ không dây layout 75%, hỗ trợ QMK/VIA tùy chỉnh phím dễ dàng.",
        specs: ["Switch Keychron K Pro", "Kết nối Bluetooth 5.1 / Type-C", "Keycap PBT Double-shot", "LED RGB"]
    }
];

// APP STATE MANAGED WITH LOCALSTORAGE
let state = {
    products: [],
    users: [],
    currentUser: null,
    cart: [],
    orders: []
};

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    initLocalStorage();
    loadState();
    renderNavbarUser();
    renderProducts();
    updateCartUI();
});

function initLocalStorage() {
    if (!localStorage.getItem("ts_products")) {
        localStorage.setItem("ts_products", JSON.stringify(initialProducts));
    }
    if (!localStorage.getItem("ts_users")) {
        const defaultUser = [
            {
                id: "u_admin",
                name: "Quản trị viên",
                email: "admin@gmail.com",
                password: "123456"
            }
        ];
        localStorage.setItem("ts_users", JSON.stringify(defaultUser));
    }
    if (!localStorage.getItem("ts_orders")) {
        localStorage.setItem("ts_orders", JSON.stringify([]));
    }
}

function loadState() {
    state.products = JSON.parse(localStorage.getItem("ts_products")) || [];
    state.users = JSON.parse(localStorage.getItem("ts_users")) || [];
    state.currentUser = JSON.parse(localStorage.getItem("ts_currentUser")) || null;
    state.cart = JSON.parse(localStorage.getItem("ts_cart")) || [];
    state.orders = JSON.parse(localStorage.getItem("ts_orders")) || [];
}

function saveCart() {
    localStorage.setItem("ts_cart", JSON.stringify(state.cart));
    updateCartUI();
}

function saveOrders() {
    localStorage.setItem("ts_orders", JSON.stringify(state.orders));
}

function saveUsers() {
    localStorage.setItem("ts_users", JSON.stringify(state.users));
}

// FORMAT CURRENCY
function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// VIEW MANAGEMENT
function showView(viewName) {
    const productsView = document.getElementById("productsView");
    const ordersView = document.getElementById("ordersView");

    if (viewName === 'products') {
        productsView.classList.remove("hidden");
        ordersView.classList.add("hidden");
    } else if (viewName === 'orders') {
        if (!state.currentUser) {
            openAuthModal('login');
            showToast("Yêu cầu", "Vui lòng đăng nhập để xem lịch sử đơn hàng", "info");
            return;
        }
        productsView.classList.add("hidden");
        ordersView.classList.remove("hidden");
        renderOrders();
    }
}

// RENDER PRODUCTS
function renderProducts(itemsToRender = state.products) {
    const grid = document.getElementById("productGrid");
    if (itemsToRender.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl border p-8">
            <i class="fa-solid fa-box-open text-5xl mb-3 text-indigo-300 block"></i>
            <p class="font-medium">Không tìm thấy sản phẩm phù hợp.</p>
        </div>`;
        return;
    }

    grid.innerHTML = itemsToRender.map(p => `
        <div class="bg-white border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
            <div class="relative bg-gray-100 overflow-hidden cursor-pointer h-52 flex items-center justify-center p-2" onclick="openProductDetail('${p.id}')">
                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 rounded-lg">
                <span class="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                    ${p.category}
                </span>
            </div>
            <div class="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 onclick="openProductDetail('${p.id}')" class="font-bold text-gray-800 text-base mb-1 hover:text-indigo-600 cursor-pointer line-clamp-1 transition">
                        ${p.name}
                    </h3>
                    <p class="text-xs text-gray-500 line-clamp-2 mb-3">${p.description}</p>
                </div>
                <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span class="font-extrabold text-indigo-600 text-base">${formatVND(p.price)}</span>
                    <button onclick="addToCart('${p.id}')" class="bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 p-2.5 rounded-xl transition duration-200">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// FILTER PRODUCTS
function filterProducts() {
    const searchVal = document.getElementById("searchInput").value.toLowerCase().trim();
    const categoryVal = document.getElementById("categoryFilter").value;

    const filtered = state.products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchVal) || p.description.toLowerCase().includes(searchVal);
        const matchCategory = categoryVal === "ALL" || p.category === categoryVal;
        return matchSearch && matchCategory;
    });

    renderProducts(filtered);
}

// PRODUCT DETAIL MODAL
function openProductDetail(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const modalBody = document.getElementById("productModalBody");
    modalBody.innerHTML = `
        <div class="rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center p-2">
            <img src="${product.image}" alt="${product.name}" class="max-h-80 object-cover rounded-lg w-full">
        </div>
        <div class="flex flex-col justify-between">
            <div>
                <span class="text-xs font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-full">${product.category}</span>
                <h2 class="text-2xl font-bold text-gray-800 mt-2 mb-2">${product.name}</h2>
                <p class="text-2xl font-black text-indigo-600 mb-4">${formatVND(product.price)}</p>
                <p class="text-gray-600 text-sm mb-4 leading-relaxed">${product.description}</p>
                
                <div class="mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <h4 class="text-xs font-bold text-gray-700 uppercase mb-2">Thông số kỹ thuật:</h4>
                    <ul class="text-xs text-gray-600 space-y-1.5">
                        ${product.specs ? product.specs.map(s => `<li class="flex items-center"><i class="fa-solid fa-check text-green-500 mr-2 text-xs"></i>${s}</li>`).join('') : ''}
                    </ul>
                </div>
            </div>
            <button onclick="addToCart('${product.id}'); closeModal('productModal');" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg">
                <i class="fa-solid fa-cart-plus"></i>
                <span>Thêm vào giỏ hàng</span>
            </button>
        </div>
    `;
    document.getElementById("productModal").classList.remove("hidden");
}

// MODAL CONTROLS
function closeModal(modalId) {
    document.getElementById(modalId).classList.add("hidden");
}

function toggleCartModal() {
    const modal = document.getElementById("cartModal");
    modal.classList.toggle("hidden");
}

function openAuthModal(tab = 'login') {
    switchAuthTab(tab);
    document.getElementById("authModal").classList.remove("hidden");
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const tabLoginBtn = document.getElementById("tabLoginBtn");
    const tabRegisterBtn = document.getElementById("tabRegisterBtn");

    if (tab === 'login') {
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
        tabLoginBtn.className = "flex-1 py-2 font-semibold text-center border-b-2 border-indigo-600 text-indigo-600 transition";
        tabRegisterBtn.className = "flex-1 py-2 font-semibold text-center border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition";
    } else {
        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");
        tabRegisterBtn.className = "flex-1 py-2 font-semibold text-center border-b-2 border-indigo-600 text-indigo-600 transition";
        tabLoginBtn.className = "flex-1 py-2 font-semibold text-center border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition";
    }
}

// AUTHENTICATION
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const user = state.users.find(u => u.email === email && u.password === password);
    if (user) {
        state.currentUser = user;
        localStorage.setItem("ts_currentUser", JSON.stringify(user));
        renderNavbarUser();
        closeModal("authModal");
        showToast("Thành công", `Xin chào, ${user.name}!`, "success");
    } else {
        showToast("Lỗi", "Email hoặc mật khẩu không chính xác!", "error");
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    if (state.users.some(u => u.email === email)) {
        showToast("Lỗi", "Email này đã được đăng ký!", "error");
        return;
    }

    const newUser = {
        id: "u_" + Date.now(),
        name,
        email,
        password
    };

    state.users.push(newUser);
    saveUsers();

    state.currentUser = newUser;
    localStorage.setItem("ts_currentUser", JSON.stringify(newUser));

    renderNavbarUser();
    closeModal("authModal");
    showToast("Thành công", "Đăng ký tài khoản thành công!", "success");
}

function handleLogout() {
    state.currentUser = null;
    localStorage.removeItem("ts_currentUser");
    renderNavbarUser();
    showView("products");
    showToast("Thông báo", "Đã đăng xuất tài khoản", "info");
}

function renderNavbarUser() {
    const userSection = document.getElementById("userSection");
    const navOrdersBtn = document.getElementById("navOrdersBtn");

    if (state.currentUser) {
        navOrdersBtn.classList.remove("hidden");
        userSection.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="flex items-center space-x-2 text-sm font-semibold bg-indigo-700 px-3 py-1.5 rounded-full border border-indigo-500">
                    <i class="fa-solid fa-user-circle text-lg"></i>
                    <span>${state.currentUser.name}</span>
                </div>
                <button onclick="handleLogout()" title="Đăng xuất" class="hover:text-red-200 text-sm transition p-1">
                    <i class="fa-solid fa-right-from-bracket text-lg"></i>
                </button>
            </div>
        `;
    } else {
        navOrdersBtn.classList.add("hidden");
        userSection.innerHTML = `
            <button onclick="openAuthModal('login')" class="bg-white text-indigo-600 font-semibold px-4 py-1.5 rounded-full text-sm hover:bg-indigo-50 transition shadow-sm">
                Đăng nhập
            </button>
        `;
    }
}

// CART MANAGEMENT
function addToCart(productId) {
    const existing = state.cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        const product = state.products.find(p => p.id === productId);
        if (product) {
            state.cart.push({ ...product, quantity: 1 });
        }
    }
    saveCart();
    showToast("Thành công", "Đã thêm sản phẩm vào giỏ hàng!", "success");
}

function updateQuantity(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        state.cart = state.cart.filter(i => i.id !== productId);
    }
    saveCart();
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(i => i.id !== productId);
    saveCart();
    showToast("Thông báo", "Đã xóa sản phẩm khỏi giỏ hàng", "info");
}

function updateCartUI() {
    const badge = document.getElementById("cartBadge");
    const container = document.getElementById("cartItemsContainer");
    const totalEl = document.getElementById("cartTotal");

    const totalCount = state.cart.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = state.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    if (totalCount > 0) {
        badge.innerText = totalCount;
        badge.classList.remove("hidden");
    } else {
        badge.classList.add("hidden");
    }

    totalEl.innerText = formatVND(totalPrice);

    if (state.cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-gray-400">
                <i class="fa-solid fa-cart-arrow-down text-5xl mb-3 block text-gray-300"></i>
                <p class="text-sm font-medium">Giỏ hàng trống</p>
            </div>`;
        return;
    }

    container.innerHTML = state.cart.map(item => `
        <div class="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <img src="${item.image}" class="w-16 h-16 object-cover rounded-lg bg-white border">
            <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-sm text-gray-800 truncate">${item.name}</h4>
                <p class="text-xs text-indigo-600 font-bold mt-0.5">${formatVND(item.price)}</p>
                <div class="flex items-center space-x-2 mt-2">
                    <button onclick="updateQuantity('${item.id}', -1)" class="w-6 h-6 bg-white border rounded-md text-xs font-bold hover:bg-gray-100 flex items-center justify-center">-</button>
                    <span class="text-xs font-semibold px-2">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)" class="w-6 h-6 bg-white border rounded-md text-xs font-bold hover:bg-gray-100 flex items-center justify-center">+</button>
                </div>
            </div>
            <button onclick="removeFromCart('${item.id}')" class="text-gray-400 hover:text-red-500 p-2 text-sm transition">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `).join('');
}

// CHECKOUT & ORDERS
function handleCheckout() {
    if (state.cart.length === 0) {
        showToast("Cảnh báo", "Giỏ hàng của bạn đang trống!", "error");
        return;
    }

    if (!state.currentUser) {
        toggleCartModal();
        openAuthModal('login');
        showToast("Yêu cầu", "Vui lòng đăng nhập để tiến hành đặt hàng!", "info");
        return;
    }

    const totalAmount = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder = {
        id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        items: [...state.cart],
        totalAmount: totalAmount,
        createdAt: new Date().toLocaleString('vi-VN'),
        status: "Đang xử lý"
    };

    state.orders.unshift(newOrder);
    saveOrders();

    // Clear cart
    state.cart = [];
    saveCart();

    toggleCartModal();
    showView("orders");
    showToast("Thành công", "Đặt hàng thành công! Cảm ơn bạn đã mua sắm.", "success");
}

function renderOrders() {
    const container = document.getElementById("ordersList");
    if (!state.currentUser) return;

    const userOrders = state.orders.filter(o => o.userId === state.currentUser.id);

    if (userOrders.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 bg-white rounded-2xl border p-8 text-gray-500">
                <i class="fa-solid fa-receipt text-5xl mb-3 text-indigo-300 block"></i>
                <p class="font-medium">Bạn chưa có đơn hàng nào.</p>
            </div>`;
        return;
    }

    container.innerHTML = userOrders.map(order => `
        <div class="bg-white rounded-2xl border p-5 shadow-sm space-y-4">
            <div class="flex flex-wrap items-center justify-between border-b pb-3 gap-2">
                <div>
                    <span class="font-bold text-gray-800">Mã đơn: #${order.id}</span>
                    <span class="text-xs text-gray-400 ml-3"><i class="fa-regular fa-clock mr-1"></i>${order.createdAt}</span>
                </div>
                <span class="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                    ${order.status}
                </span>
            </div>
            <div class="space-y-3">
                ${order.items.map(item => `
                    <div class="flex items-center justify-between text-sm">
                        <div class="flex items-center space-x-3">
                            <img src="${item.image}" class="w-12 h-12 object-cover rounded-lg border bg-gray-50">
                            <div>
                                <p class="font-medium text-gray-800">${item.name}</p>
                                <p class="text-xs text-gray-500">Số lượng: x${item.quantity}</p>
                            </div>
                        </div>
                        <span class="font-semibold text-gray-700">${formatVND(item.price * item.quantity)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="border-t pt-3 flex justify-between items-center">
                <span class="text-sm text-gray-600 font-medium">Tổng tiền thanh toán:</span>
                <span class="text-lg font-bold text-indigo-600">${formatVND(order.totalAmount)}</span>
            </div>
        </div>
    `).join('');
}

// TOAST NOTIFICATIONS
function showToast(title, message, type = 'info') {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    
    const bgColor = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-indigo-600';
    const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info';

    toast.className = `${bgColor} text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-3 transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto max-w-sm`;
    toast.innerHTML = `
        <i class="fa-solid ${icon} text-xl"></i>
        <div>
            <h5 class="font-bold text-xs uppercase tracking-wider">${title}</h5>
            <p class="text-xs mt-0.5 opacity-90">${message}</p>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove("translate-y-2", "opacity-0");
    }, 10);

    setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-2");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
