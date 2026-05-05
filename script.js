let authToken = "";

function showSection(id) {
    document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function handleAuth() {
    const token = document.getElementById('blynk-token').value;
    if (token) {
        authToken = token;
        document.getElementById('nav-control').style.display = 'inline-block';
        setInterval(fetchData, 3000);
        setInterval(updateClock, 1000);
        showSection('dashboard');
    } else { alert("Masukkan Token!"); }
}

function updateClock() {
    const now = new Date();
    document.getElementById('real-time-clock').innerText = now.toLocaleTimeString('id-ID', { hour12: false });
    document.getElementById('real-date').innerText = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
}

function controlBlynk(pin, val) {
    fetch(`https://blynk.cloud/external/api/update?token=${authToken}&${pin}=${val}`);
}

function fetchData() {
    const pins = { 'V0': 'temp-val', 'V1': 'dist-val' };
    Object.keys(pins).forEach(pin => {
        fetch(`https://blynk.cloud/external/api/get?token=${authToken}&${pin}`).then(r => r.text()).then(d => {
            const val = parseFloat(d);
            document.getElementById(pins[pin]).innerText = isNaN(val) ? "0.0" : val.toFixed(1);
            if(pin === 'V1') document.getElementById('pakan-card').style.background = val > 15 ? "#7f1d1d" : "#1e293b";
        });
    });
}

function toggleAuto() {
    const isAuto = document.getElementById('mode-auto').checked;
    document.getElementById('status-mode').innerText = isAuto ? "Mode Otomatis Aktif" : "Mode Manual Aktif";
    controlBlynk('V5', isAuto ? 1 : 0);
}

function updateJadwalPakan() {
    controlBlynk('V6', document.getElementById('h-pagi').value);
    setTimeout(() => controlBlynk('V7', document.getElementById('h-siang').value), 500);
    setTimeout(() => controlBlynk('V8', document.getElementById('h-sore').value), 1000);
    alert("Jadwal Pakan Diupdate!");
}

function updateJadwalLampu() {
    controlBlynk('V9', document.getElementById('h-lampu-on').value);
    setTimeout(() => controlBlynk('V10', document.getElementById('h-lampu-off').value), 500);
    alert("Jadwal Lampu Diupdate!");
}