let rooms = [];
let templates = ["Modello 1", "Modello 2"];

function addRoom() {
    let roomIndex = rooms.length;
    rooms.push({ name: "", length: 0, width: 0, height: 0, ceilingArea: 0, wallArea: 0, totalRoomArea: 0 });

    let roomDiv = document.createElement("div");
    roomDiv.classList.add("room");
    roomDiv.innerHTML = `
        <h4>Stanza ${roomIndex + 1}</h4>
        <label>Nome: <input type="text" onchange="updateRoom(${roomIndex}, 'name', this.value)"></label><br>
        <label>Lunghezza (m): <input type="number" onchange="updateRoom(${roomIndex}, 'length', this.value)"></label><br>
        <label>Larghezza (m): <input type="number" onchange="updateRoom(${roomIndex}, 'width', this.value)"></label><br>
        <label>Altezza (m): <input type="number" onchange="updateRoom(${roomIndex}, 'height', this.value)"></label><br>
        <p>Area soffitto: <span id="ceilingArea${roomIndex}">0</span> m²</p>
        <p>Area pareti: <span id="wallArea${roomIndex}">0</span> m²</p>
        <label>Area totale stanza: <input type="number" id="totalRoomArea${roomIndex}" onchange="adjustTotalRoomArea(${roomIndex}, this.value)"></label>
    `;
    document.getElementById("rooms").appendChild(roomDiv);
}

function updateRoom(index, field, value) {
    rooms[index][field] = parseFloat(value) || 0;
    calculateRoomAreas(index);
}

function calculateRoomAreas(index) {
    let room = rooms[index];
    room.ceilingArea = room.length * room.width;
    room.wallArea = 2 * (room.length + room.width) * room.height;
    room.totalRoomArea = room.ceilingArea + room.wallArea;

    document.getElementById(`ceilingArea${index}`).innerText = room.ceilingArea;
    document.getElementById(`wallArea${index}`).innerText = room.wallArea;
    document.getElementById(`totalRoomArea${index}`).value = room.totalRoomArea;
}

function adjustTotalRoomArea(index, value) {
    rooms[index].totalRoomArea = parseFloat(value) || 0;
}

function calculateTotal() {
    let totalArea = rooms.reduce((sum, room) => sum + room.totalRoomArea, 0);
    document.getElementById("totalArea").value = totalArea;

    let pricePerMeter = parseFloat(document.getElementById("pricePerMeter").value) || 0;
    document.getElementById("finalCost").value = totalArea * pricePerMeter;
}

function addTemplate() {
    let newTemplate = prompt("Inserisci il nome del nuovo modello:");
    if (newTemplate) {
        templates.push(newTemplate);
        let select = document.getElementById("templateSelect");
        let option = document.createElement("option");
        option.value = newTemplate;
        option.textContent = newTemplate;
        select.appendChild(option);
    }
}

function sendEmail() {
    let email = document.getElementById("email").value;
    let clientName = document.getElementById("clientName").value;
    let totalArea = document.getElementById("totalArea").value;
    let finalCost = document.getElementById("finalCost").value;
    let template = document.getElementById("templateSelect").value;
    let subject = "Calcolo del costo della ristrutturazione";
    let body = `Cliente: ${clientName}\nModello: ${template}\nArea totale: ${totalArea} m²\nCosto finale: ${finalCost} €`;

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
