// app.js
const CSV_URL = "https://docs.google.com/spreadsheets/d/1KVXIFIgiL80kNAuZQh1Q88_6bi7YeiWXt5GvQVj7Xwo/gviz/tq?tqx=out:csv&gid=0";
const TEL = "59894502637"; // ejemplo: 59899123456

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.replace(/"/g, "").trim());

  return lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.replace(/"/g, "").trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = values[i] ?? "");
    return obj;
  });
}
    headers.forEach((h, i) => obj[h] = values[i] ?? "");
    return obj;
  });
}
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = values[i] ?? "");
    return obj;
  });
}

async function cargarCatalogo() {
  const contenedor = document.querySelector(".productos");
  contenedor.innerHTML = "<p>Cargando productos...</p>";

  const resp = await fetch(CSV_URL);
  const csv = await resp.text();
  const productos = parseCSV(csv).filter(p => (p.activo || "").toLowerCase() === "si");

  if (!productos.length) {
    contenedor.innerHTML = "<p>No hay productos disponibles por el momento.</p>";
    return;
  }

  contenedor.innerHTML = productos.map(p => {
    const msg = encodeURIComponent(p.mensaje || `Hola, quiero info sobre ${p.nombre}`);
    const wa = `https://wa.me/${TEL}?text=${msg}`;
    const precio = p.precio ? `$ ${p.precio}` : "";

    // Si no hay imagen, mostramos un cuadro en gris
    const imagenHTML = p.imagen
      ? `<img src="${p.imagen}" alt="${p.nombre}">`
      : `<div style="height:180px;background:#ddd;border-radius:10px;display:flex;align-items:center;justify-content:center;">Sin foto</div>`;

    return `
      <div class="producto">
        ${imagenHTML}
        <h2>${p.nombre}</h2>
        <p>${p.medidas || ""}</p>
        <p class="precio">${precio}</p>
        <a class="boton" href="${wa}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
      </div>
    `;
  }).join("");
}


cargarCatalogo();
