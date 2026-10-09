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
const box=document.getElementById('cart-items');
const totalEl=document.getElementById('cart-total');
const subtotalEl=document.getElementById('cart-subtotal');
const deliveryCostEl=document.getElementById('delivery-cost');
const deliveryNoteEl=document.getElementById('delivery-note');
const method=document.querySelector('input[name="delivery-method"]:checked')?.value||'courier';
const addressFields=document.getElementById('delivery-address-fields');
const addressInputs=['address-line1','address-suburb','address-city','address-province','address-postal-code'];
if(addressFields){
  addressFields.hidden=method!=='courier';
  addressInputs.forEach(id=>{const el=document.getElementById(id);if(el)el.required=method==='courier';});
}
let subtotal=0;
const validItems=cart.map(item=>({item,p:products.find(x=>x.id===item.id)})).filter(x=>x.p);
box.innerHTML=validItems.length?validItems.map(({item,p})=>{const line=p.price*item.qty;subtotal+=line;return `<div class="flex items-center gap-4 p-3 rounded-2xl bg-pink-50"><img src="${p.image}" alt="${p.name}" class="w-20 h-20 object-contain bg-white rounded-xl" onerror="this.style.display='none'"><div class="min-w-0 flex-1"><div class="font-bold truncate">${p.name}</div><div class="text-sm text-slate-500">${money(p.price)} each</div><div class="flex items-center gap-2 mt-2"><button class="quantity-btn bg-white border border-pink-200" onclick="changeQuantity('${p.id}',-1)">−</button><span class="font-bold w-6 text-center">${item.qty}</span><button class="quantity-btn bg-white border border-pink-200" onclick="changeQuantity('${p.id}',1)">+</button></div></div><div class="font-bold text-squish-purple">${money(line)}</div><button onclick="removeFromCart('${p.id}')" class="text-rose-400 hover:text-rose-600 p-1" aria-label="Remove item"><i class="fa-solid fa-xmark"></i></button></div>`}).join(''):'<div class="text-center py-8 text-slate-500"><i class="fa-solid fa-cart-shopping text-3xl mb-3 text-squish-pink"></i><p>Your cart is empty.</p><a href="#products" class="inline-block mt-3 text-squish-purple font-bold">Browse products</a></div>';
if(subtotalEl)subtotalEl.textContent=money(subtotal);
if(method==='pickup'){
  if(deliveryCostEl)deliveryCostEl.textContent='Free';
  if(deliveryNoteEl)deliveryNoteEl.textContent='Free local pickup in Krugersdorp West. Usually ready within 1–2 business days; wait for WhatsApp confirmation before collecting.';
  totalEl.textContent=money(subtotal);
}else{
  if(deliveryCostEl)deliveryCostEl.textContent='R60–R100 (estimate)';
  if(deliveryNoteEl)deliveryNoteEl.textContent='Courier charges may vary by parcel size, weight and delivery location. We’ll confirm the exact charge on WhatsApp before payment.';
  totalEl.textContent=money(subtotal)+' + courier (R60–R100 estimate)';
}
saveCart();
}
function sendWhatsAppOrder(){
if(!cart.length){alert('Please add at least one product to your cart.');return;}
const get=id=>(document.getElementById(id)?.value||'').trim();
const name=get('customer-name');
const phone=get('customer-phone');
const method=document.querySelector('input[name="delivery-method"]:checked')?.value||'courier';
if(!name){alert('Please enter your name.');document.getElementById('customer-name').focus();return;}
const addressIds=['address-line1','address-suburb','address-city','address-province','address-postal-code'];
if(method==='courier'){
  const missing=addressIds.find(id=>!get(id));
  if(missing){alert('Please complete the required delivery address fields so the courier can find you.');document.getElementById(missing).focus();return;}
}
let subtotal=0;
const lines=cart.map(item=>{const p=products.find(x=>x.id===item.id);if(!p)return '';const line=p.price*item.qty;subtotal+=line;return '  • '+p.name+' x'+item.qty+' — '+money(line);}).filter(Boolean).join('\\n');
const divider='━━━━━━━━━━━━━━━━━━';
let deliverySection='';
let addressSection='';
let totalSection='';
if(method==='pickup'){
  deliverySection='🚚 *DELIVERY OPTION*\\nMethod: Free local pickup\\nArea: Krugersdorp West\\nPickup readiness: Usually within 1–2 business days\\nCollection: Please wait for our WhatsApp confirmation before collecting.';
  totalSection='Product subtotal: '+money(subtotal)+'\\nPickup fee: FREE\\n*TOTAL: '+money(subtotal)+'*';
}else{
  deliverySection='🚚 *DELIVERY OPTION*\\nCourier: The Courier Guy (nationwide)\\nCourier fee: Estimated R60–R100\\nFinal fee: To be confirmed by Squishyville before payment\\nDispatch: We will confirm the dispatch date after checking product availability\\nTransit time: Estimated 2–4 business days after dispatch\\nNote: Courier charges may vary by parcel size, weight and delivery location. Tracking details will be shared on WhatsApp once shipped.';
  addressSection='📍 *DELIVERY ADDRESS*\\nStreet: '+get('address-line1')+'\\nComplex / unit / building: '+(get('address-line2')||'Not provided')+'\\nSuburb: '+get('address-suburb')+'\\nCity / town: '+get('address-city')+'\\nProvince: '+get('address-province')+'\\nPostal code: '+get('address-postal-code')+'\\nDelivery instructions: '+(get('delivery-instructions')||'Not provided');
  totalSection='Product subtotal: '+money(subtotal)+'\\nCourier fee: R60–R100 (estimate)\\n*ESTIMATED TOTAL: '+money(subtotal+60)+'–'+money(subtotal+100)+'*\\nFinal total: To be confirmed before payment';
}
const message='🛍️ *SQUISHYVILLE — NEW ORDER*\\n'+divider+'\\n\\n👤 *CUSTOMER DETAILS*\\nName: '+name+'\\nContact: '+(phone||'Not provided')+'\\n\\n📦 *ORDER SUMMARY*\\n'+lines+'\\n\\n'+divider+'\\n💰 *ORDER TOTAL*\\n'+totalSection+'\\n\\n'+divider+'\\n'+deliverySection+(addressSection?'\\n\\n'+divider+'\\n'+addressSection:'')+'\\n\\n'+divider+'\\n📋 *STOCK & PAYMENT STATUS*\\nProduct availability: Please confirm stock for each item before payment\\nPayment status: Awaiting confirmation\\nPayment method requested: Yoco payment link\\nNext step: Squishyville to confirm availability, dispatch/pickup timing and final amount before sending the payment link.\\n\\nThank you for supporting Squishyville! 💗';
window.open('https://wa.me/'+STORE_PHONE+'?text='+encodeURIComponent(message),'_blank');
}
function openWhatsApp(){window.open('https://wa.me/'+STORE_PHONE+'?text='+encodeURIComponent('Hi Squishyville! I have a question about your products.'),'_blank');}
function toggleFaq(button){const content=button.nextElementSibling;content.classList.toggle('open');const icon=button.querySelector('i');if(icon)icon.classList.toggle('rotate-180');}
renderProducts();renderCart();
