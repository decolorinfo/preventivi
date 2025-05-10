document.addEventListener("DOMContentLoaded", function () {
  let today = new Date();
  let formattedDate = today.toLocaleDateString("it-IT");
  document.getElementById("currentDate").innerText = formattedDate;
});

let rooms = [];

function addRoom() {
  let roomIndex = rooms.length;
  rooms.push({ name: "", length: 0, width: 0, height: 0, ceilingArea: 0, wallArea: 0 });

  let roomDiv = document.createElement("div");
  roomDiv.classList.add("room");
  roomDiv.innerHTML = `
      <h4>Stanza ${roomIndex + 1}</h4>
      <label>Nome: <input type="text" onchange="updateRoom(${roomIndex}, 'name', this.value)"></label><br>
      <label>Lunghezza (m): <input type="number" onchange="updateRoom(${roomIndex}, 'length', this.value)"></label><br>
      <label>Larghezza (m): <input type="number" onchange="updateRoom(${roomIndex}, 'width', this.value)"></label><br>
      <label>Altezza (m): <input type="number" onchange="updateRoom(${roomIndex}, 'height', this.value)"></label><br>
  `;
  document.getElementById("rooms").appendChild(roomDiv);
}

function updateRoom(index, field, value) {
  rooms[index][field] = parseFloat(value) || 0;
  calculateTotal();
}

function calculateTotal() {
  let totalArea = rooms.reduce((sum, room) => sum + (2 * (room.length + room.width) * room.height), 0);
  document.getElementById("totalArea").value = totalArea;

  let pricePerMeter = parseFloat(document.getElementById("pricePerMeter").value) || 0;
  document.getElementById("finalCost").value = totalArea * pricePerMeter;
}

async function generateDocxFile() {
  let fileInput = document.getElementById("uploadTemplate");
  let file = fileInput.files[0];

  if (!file) {
      alert("Carica prima un modello!");
      return;
  }

  let clientName = document.getElementById("clientName").value;
  let finalCost = document.getElementById("finalCost").value;
  let currentDate = document.getElementById("currentDate").innerText;

  let reader = new FileReader();
  reader.onload = async function (event) {
      let arrayBuffer = event.target.result;
      let zip = new JSZip();
      await zip.loadAsync(arrayBuffer);
      let text = await zip.file("word/document.xml").async("string");

      text = text.replace("{cliente}", clientName)
                 .replace("{costo}", finalCost)
                 .replace("{data}", currentDate);

      zip.file("word/document.xml", text);
      let newDocx = await zip.generateAsync({ type: "blob" });

      let link = document.createElement("a");
      link.href = URL.createObjectURL(newDocx);
      link.download = "Preventivo_Ristrutturazione.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  reader.readAsArrayBuffer(file);
}
