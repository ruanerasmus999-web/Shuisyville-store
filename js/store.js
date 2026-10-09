let cart=JSON.parse(localStorage.getItem('squishyville-cart')||'[]');

function money(n){return 'R'+Number(n).toFixed(0)}
function saveCart(){localStorage.setItem('squishyville-cart',JSON.stringify(cart))}
function renderProducts(){
const grid=document.getElementById('product-grid');
grid.innerHTML=products.map(p=>`<article class="product-card bg-white rounded-3xl border border-pink-100 overflow-hidden shadow-sm"><div class="bg-squish-softpink p-4"><img src="${p.image}" alt="${p.name}" class="w-full h-64 object-contain rounded-2xl" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x500/FFE5EC/9B5DE5?text='+encodeURIComponent('${p.name}');"></div><div class="p-5"><div class="flex items-start justify-between gap-3"><h3 class="font-bold text-lg text-slate-900">${p.name}</h3><span class="shrink-0 bg-purple-50 text-squish-purple font-bold px-3 py-1 rounded-full">${money(p.price)}</span></div><button onclick="addToCart('${p.id}')" class="w-full mt-5 bg-squish-purple hover:bg-purple-700 text-white font-bold py-3 rounded-2xl transition"><i class="fa-solid fa-cart-plus mr-2"></i>Add to Cart</button></div></article>`).join('');
}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();renderCart();document.getElementById('cart').scrollIntoView({behavior:'smooth'});}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart();renderCart();}
function changeQuantity(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)removeFromCart(id);else{saveCart();renderCart();}}
function clearCart(){cart=[];saveCart();renderCart();}
function renderCart(){
const box=document.getElementById('cart-items'),totalEl=document.getElementById('cart-total'),subtotalEl=document.getElementById('cart-subtotal'),deliveryCostEl=document.getElementById('delivery-cost'),deliveryNoteEl=document.getElementById('delivery-note');
const methodEl=document.getElementById('delivery-method');
const method=methodEl?methodEl.value:'courier';
if(!cart.length){box.innerHTML='<div class="text-center py-8 text-slate-500"><i class="fa-solid fa-cart-shopping text-3xl mb-3 text-squish-pink"></i><p>Your cart is empty.</p><a href="#products" class="inline-block mt-3 text-squish-purple font-bold">Browse products</a></div>';totalEl.textContent='R0';if(subtotalEl)subtotalEl.textContent='R0';if(deliveryCostEl)deliveryCostEl.textContent=method==='pickup'?'Free':'R60–R100 (estimate)';return;}
let total=0;
box.innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id);if(!p)return '';const line=p.price*item.qty;total+=line;return `<div class="flex items-center gap-4 p-3 rounded-2xl bg-pink-50"><img src="${p.image}" alt="${p.name}" class="w-20 h-20 object-contain bg-white rounded-xl" onerror="this.style.display='none'"><div class="min-w-0 flex-1"><div class="font-bold truncate">${p.name}</div><div class="text-sm text-slate-500">${money(p.price)} each</div><div class="flex items-center gap-2 mt-2"><button class="quantity-btn bg-white border border-pink-200" onclick="changeQuantity('${p.id}',-1)">−</button><span class="font-bold w-6 text-center">${item.qty}</span><button class="quantity-btn bg-white border border-pink-200" onclick="changeQuantity('${p.id}',1)">+</button></div></div><div class="font-bold text-squish-purple">${money(line)}</div><button onclick="removeFromCart('${p.id}')" class="text-rose-400 hover:text-rose-600 p-1" aria-label="Remove item"><i class="fa-solid fa-xmark"></i></button></div>`}).join('');
if(subtotalEl)subtotalEl.textContent=money(total);
if(method==='pickup'){if(deliveryCostEl)deliveryCostEl.textContent='Free';if(deliveryNoteEl)deliveryNoteEl.textContent='Free local pickup in Krugersdorp West. Usually ready within 1–2 business days; wait for WhatsApp confirmation before collecting.';totalEl.textContent=money(total);}
else{if(deliveryCostEl)deliveryCostEl.textContent='R60–R100 (estimate)';if(deliveryNoteEl)deliveryNoteEl.textContent='Courier charges may vary by parcel size, weight and delivery location. We’ll confirm the exact charge on WhatsApp before payment.';totalEl.textContent=money(total)+' + courier (R60–R100 estimate)';}
}
function sendWhatsAppOrder(){
if(!cart.length){alert('Please add at least one product to your cart.');return;}
const name=document.getElementById('customer-name').value.trim();
const city=document.getElementById('customer-city').value.trim();
let total=0;
const lines=cart.map(item=>{const p=products.find(x=>x.id===item.id);const line=p.price*item.qty;total+=line;return `• ${p.name} x${item.qty} = ${money(line)}`;}).join('\n');
const message=`Hi Squishyville! I'd like to place an order.\n\nName: ${name||'Not provided'}\nCity/Area: ${city||'Not provided'}\n\nOrder:\n${lines}\n\nProduct total: ${money(total)}\n\nPlease confirm availability, delivery cost and payment details.`;
window.open('https://wa.me/'+STORE_PHONE+'?text='+encodeURIComponent(message),'_blank');
}
function openWhatsApp(){window.open('https://wa.me/'+STORE_PHONE+'?text='+encodeURIComponent('Hi Squishyville! I have a question about your products.'),'_blank');}
function toggleFaq(button){const content=button.nextElementSibling;content.classList.toggle('open');const icon=button.querySelector('i');if(icon)icon.classList.toggle('rotate-180');}
renderProducts();renderCart();
