const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const cartCounter = document.getElementById("cart-count")
const closeModalBtn = document.getElementById("close-modal-btn")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

// abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "Flex"
})

// fechar modal do carrinho 
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }  
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})

function addToCart(name, price){

    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantidy += 1;
    }else{
        cart.push({
            name,
            price,
            quantidy: 1,
        })
    }
    updateCartModal()
}

function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class= "flex items-center justify-between">
            <div>
                <p class= " font-medium">${item.name}</p>
                <p>${item.quantidy}</p>
                <p class= "font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <div>
                <button class= "remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        </div>
        `

        total += item.price * item.quantidy;
        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    cartCounter.innerHTML = cart.length;

}

cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item=> item.name === name);

    if(index !== -1 ){
        const item = cart[index];
        if(item.quantidy > 1 ){
            item.quantidy -=1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

checkoutBtn.addEventListener("click",  function(){

    const isOpen = checkHamburgueriaOpen();
    if(!isOpen){

        Toastify({
        text: "Ops o restaurante esta fechado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444",
        },
    }).showToast();
        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }
    const cartItems = cart.map((item) => {
        return(
            `${item.name} Quantidade: (${item.quantidy}) Preço: R$${item.price}`
         )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "31971659344"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})

function checkHamburgueriaOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; 
}

const spanItem = document.getElementById("date-span")
const isOpen = checkHamburgueriaOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")

}