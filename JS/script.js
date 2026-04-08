let displayValue = '0';
const display = document.getElementById('display');
const COLORES  = ['#ff4d6d','#ff9f1c','#ffdd00','#06d6a0','#4cc9f0','#c77dff','#f72585'];
const SIMBOLOS = ['+','-','×','÷','=','1','2','3','4','5','6','7','8','9','0'];

// === CALCULADORA ===
function press(key) {
    if (displayValue === '0' && key >= '0' && key <= '9') displayValue = key;
    else if (key === '.' && displayValue.includes('.')) return;
    else displayValue += key;
    display.value = displayValue;
}
function clearDisplay() { display.value = displayValue = '0'; }
function calculate() {
    try { display.value = displayValue = eval(displayValue).toString(); }
    catch { display.value = 'Math error'; setTimeout(() => display.value = displayValue = '0', 1500); }
}

// === NOMBRE Y SALUDO ===
function guardarNombre() {
    const nombre = document.getElementById('nombre-input').value.trim();
    if (!nombre) return;
    localStorage.setItem('calc_nombre', nombre);
    document.getElementById('overlay').remove();
    mostrarSaludo(nombre);
}
function mostrarSaludo(nombre) {
    const ops = ['¡Hola', '¡Bienvenido/a', '¡Buenas'];
    document.getElementById('saludo').textContent =
        `${ops[Math.floor(Math.random()*ops.length)]}, ${nombre}! 🎉`;
}

// === FIGURAS FLOTANTES ===
const MAX_FIGURAS = 12;
let activas = 0;

function xFuera() {
    const r = document.querySelector('.calculator')?.getBoundingClientRect();
    const izq = r ? r.left - 20 : window.innerWidth * 0.3;
    const der  = r ? r.right + 20 : window.innerWidth * 0.7;
    return (izq > 40 && (Math.random() > 0.5 || der > window.innerWidth - 40))
        ? Math.random() * izq
        : der + Math.random() * (window.innerWidth - der);
}
function darken(hex) {
    return `rgb(${[0,8,16].map(s => Math.max(0, (parseInt(hex.slice(1),16) >> s & 255) - 40)).reverse().join(',')})`;
}
function dibujar(ctx, tipo, c, r, color) {
    ctx.fillStyle = color; ctx.strokeStyle = darken(color); ctx.lineWidth = 2.5;
    ctx.beginPath();
    if      (tipo === 0) { ctx.arc(c, c, r, 0, Math.PI*2); }
    else if (tipo === 1) { ctx.roundRect(3, 3, c*2-6, c*2-6, 8); }
    else if (tipo === 2) { ctx.moveTo(c,4); ctx.lineTo(c*2-4,c*2-4); ctx.lineTo(4,c*2-4); ctx.closePath(); }
    else {
        for (let i = 0; i < 10; i++) {
            const a = Math.PI/5*i - Math.PI/2, R = i%2 ? r*.45 : r;
            i ? ctx.lineTo(c+R*Math.cos(a), c+R*Math.sin(a))
              : ctx.moveTo(c+R*Math.cos(a), c+R*Math.sin(a));
        }
        ctx.closePath();
    }
    ctx.fill(); ctx.stroke();
    const fy = tipo===2 ? c+6 : c+2, eo = c*.26, er = c*.12;
    [c-eo, c+eo].forEach(ex => {
        ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(ex, fy-c*.1, er*1.4, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle='#333'; ctx.beginPath(); ctx.arc(ex, fy-c*.1, er,     0, Math.PI*2); ctx.fill();
    });
    ctx.strokeStyle='#333'; ctx.lineWidth=1.8;
    ctx.beginPath(); ctx.arc(c, fy, c*.13, .2, Math.PI-.2); ctx.stroke();
    ctx.fillStyle='#fff'; ctx.font=`bold ${c*.44}px Comic Sans MS`;
    ctx.textAlign='center'; ctx.textBaseline='bottom';
    ctx.fillText(SIMBOLOS[Math.floor(Math.random()*SIMBOLOS.length)], c, c*2-2);
}
function crearFigura() {
    if (activas >= MAX_FIGURAS) return;
    activas++;
    const s = 44 + Math.random()*24, cv = document.createElement('canvas');
    cv.width = cv.height = s;
    dibujar(cv.getContext('2d'), Math.floor(Math.random()*4), s/2, s/2-3, COLORES[Math.floor(Math.random()*COLORES.length)]);
    const x = xFuera();
    cv.style.cssText = `position:fixed;left:${x}px;top:${window.innerHeight+10}px;z-index:0;pointer-events:none`;
    document.body.appendChild(cv);
    const dur = 8000 + Math.random()*5000;
    let elapsed = 0, prev = null;
    function anim(ts) {
        if (document.hidden) { prev = null; requestAnimationFrame(anim); return; }
        if (prev !== null) elapsed += ts - prev;
        prev = ts;
        const p = Math.min(elapsed / dur, 1);
        cv.style.top = (window.innerHeight+10 + (-s-10-window.innerHeight-10)*p) + 'px';
        if (p < 1) requestAnimationFrame(anim);
        else { cv.remove(); activas--; }
    }
    requestAnimationFrame(anim);
}
let loop;
function iniciarLoop() {
    if (document.hidden) { loop = setTimeout(iniciarLoop, 800); return; }
    crearFigura();
    loop = setTimeout(iniciarLoop, 700 + Math.random()*900);
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) { clearTimeout(loop); iniciarLoop(); } });

// === INIT ===
window.onload = () => {
    display.value = displayValue;
    const nombre = localStorage.getItem('calc_nombre');
    if (nombre) {
        document.getElementById('overlay').remove();
        mostrarSaludo(nombre);
    } else {
        const input = document.getElementById('nombre-input');
        input.focus();
        input.addEventListener('keydown', e => { if (e.key === 'Enter') guardarNombre(); });
        document.getElementById('btn-entrar').addEventListener('click', guardarNombre);
    }
    iniciarLoop();
};

// === TECLADO ===
document.addEventListener('keydown', e => {
    if (e.key>='0' && e.key<='9') display.value += e.key;
    if (['+','-','*','/'].includes(e.key)) display.value += ' '+e.key+' ';
    if (e.key==='Enter' || e.key==='=') display.value = eval(display.value);
    if (e.key==='Backspace') display.value = display.value.slice(0,-1);
    if (e.key==='Escape') display.value = '';
});