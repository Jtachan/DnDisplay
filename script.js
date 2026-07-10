(function () {
  const DB_URL = "sheets/dnd.json";
  const STAT_KEYS = ["FUE", "INT", "DES", "SAB", "CON", "CAR"];

  const container = document.getElementById("sheets-container");
  let DB = {};

  function createAddButton() {
    const addBtn = document.createElement("button");
    addBtn.textContent = "Add new sheet";
    addBtn.className = "dnd-btn dnd-add-btn";
    addBtn.addEventListener("click", () => {
      const sheet = createSheet();
      container.insertBefore(sheet, addBtn);
    });
    return addBtn;
  }

  function createSheet() {
    const wrapper = document.createElement("div");
    wrapper.className = "dnd-sheet";

    const select = document.createElement("select");
    select.className = "dnd-sheet-select";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "-- select a sheet --";
    select.appendChild(placeholder);

    Object.keys(DB)
      .sort((a, b) => a.localeCompare(b))
      .forEach((name) => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
      });

    const content = document.createElement("div");
    content.className = "dnd-sheet-content";

    const footer = document.createElement("div");
    footer.className = "dnd-sheet-footer";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove sheet";
    removeBtn.className = "dnd-btn dnd-remove-btn";
    removeBtn.addEventListener("click", () => wrapper.remove());
    footer.appendChild(removeBtn);

    select.addEventListener("change", () => renderContent(content, DB[select.value]));

    wrapper.appendChild(select);
    wrapper.appendChild(content);
    wrapper.appendChild(footer);

    return wrapper;
  }

  function renderContent(content, item) {
    content.innerHTML = "";
    if (!item) return;

    // Quick row: CA / PG / Vel
    const quickRow = document.createElement("div");
    quickRow.className = "dnd-quick-row";
    [
      { key: "CA", label: "CA" },
      { key: "PG", label: "PG" },
      { key: "Vel", label: "Vel" },
    ].forEach(({ key, label }) => {
      const stat = document.createElement("div");
      stat.className = "dnd-quick-stat";

      const labelEl = document.createElement("span");
      labelEl.className = "label";
      labelEl.textContent = label;

      const valueEl = document.createElement("span");
      valueEl.className = "value";
      valueEl.textContent = item[key];

      stat.appendChild(labelEl);
      stat.appendChild(valueEl);
      quickRow.appendChild(stat);
    });
    content.appendChild(quickRow);

    // Ability score table
    const table = document.createElement("table");
    table.className = "dnd-stat-table";

    const headRow = document.createElement("tr");
    const bodyRow = document.createElement("tr");
    STAT_KEYS.forEach((key) => {
      const th = document.createElement("th");
      th.textContent = key;
      headRow.appendChild(th);

      const td = document.createElement("td");
      td.textContent = item[key];
      bodyRow.appendChild(td);
    });
    table.appendChild(headRow);
    table.appendChild(bodyRow);
    content.appendChild(table);

    // Inventory / actions
    const invTitle = document.createElement("h4");
    invTitle.className = "dnd-inventory-title";
    invTitle.textContent = "Inventory / Actions";
    content.appendChild(invTitle);

    const ul = document.createElement("ul");
    ul.className = "dnd-inventory-list";
    (item["inventory/actions"] || []).forEach((entry) => {
      const li = document.createElement("li");
      li.textContent = entry;
      ul.appendChild(li);
    });
    content.appendChild(ul);
  }

  fetch(DB_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${DB_URL}: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      DB = data;
      container.appendChild(createAddButton());
    })
    .catch((err) => {
      console.error(err);
      container.textContent = "Could not load DnD database.";
    });
})();