(() => {
    const $ = (s) => document.querySelector(s);
    const list = $("#list");
    const chips = $("#chips");
    let items = [];

   const norm = (s) => (s || "").toString().toLowerCase().replace(/[^\w가-힣#]/g, "");

   function match(item, q) {
         if (!q) return true;
         const raw = q.trim().toLowerCase();
         const digits = raw.replace(/[^\d]/g, "");
         if (digits && (String(item.no) === digits || String(item.no).padStart(3, "0") === digits)) return true;
         if (raw.startsWith("#") && String(item.no) === raw.slice(1)) return true;
         return norm(item.title).includes(norm(raw));
   }

   function badge(item) {
         if (item.image) {
                 const img = document.createElement("img");
                 img.className = "thumb"; img.src = item.image; img.alt = "";
                 img.loading = "lazy"; img.referrerPolicy = "no-referrer";
                 img.onerror = () => { img.replaceWith(placeholder(item)); };
                 return img;
         }
         return placeholder(item);
   }

   function placeholder(item) {
         const d = document.createElement("div");
         d.className = "thumb"; d.textContent = item.code; return d;
   }
    function card(item) {
          const el = document.createElement("article");
          el.className = "card";

      const body = document.createElement("div");
          body.className = "body";

      const top = document.createElement("div");
          top.className = "top";
          const no = document.createElement("span"); no.className = "no"; no.textContent = item.code;
          top.appendChild(no);
          if (item.category) {
                  const c = document.createElement("span"); c.className = "price"; c.textContent = item.category;
                  top.appendChild(c);
          }
          const title = document.createElement("div"); title.className = "title"; title.textContent = item.title;
          const price = document.createElement("div"); price.className = "price";
          price.textContent = item.price_text || "";

      const acts = document.createElement("div"); acts.className = "acts";
          (item.links || []).forEach((l) => {
                  const a = document.createElement("a");
                  a.className = "btn " + (l.network === "toss" ? "toss" : "coupang");
                  a.href = l.url; a.target = "_blank"; a.rel = "nofollow sponsored noopener";
                  a.textContent = (l.label || l.network) + "에서 보기";
                  acts.appendChild(a);
          });
          if (!(item.links || []).length || item.status === "check") {
                  const d = document.createElement("span"); d.className = "btn check";
                  d.textContent = "준비 중"; acts.appendChild(d);
          }

      body.append(top, title, price, acts);
          el.append(badge(item), body);
          return el;
    }

   function render(q) {
         const hits = items.filter((i) => match(i, q));
         list.replaceChildren(...hits.map(card));
         $("#empty").hidden = hits.length > 0;
   }
    function renderChips() {
          const recent = items.slice(0, 10);
          chips.replaceChildren(...recent.map((i) => {
                  const a = document.createElement("a");
                  a.className = "chip"; a.href = "#" + i.code; a.textContent = i.code;
                  a.addEventListener("click", (e) => {
                            e.preventDefault(); $("#q").value = String(i.no); render(String(i.no));
                            window.scrollTo({ top: 0, behavior: "smooth" });
                  });
                  return a;
          }));
    }
    async function boot() {
          try {
                  const res = await fetch("./products.json?ts=" + Date.now(), { cache: "no-store" });
                  const doc = await res.json();
                  items = (doc.items || []).slice().sort((a, b) => b.no - a.no);
                  $("#disclosure").textContent = doc.disclosure || "";
                  $("#updated").textContent = "업데이트 " + (doc.updated_at || "").slice(0, 16).replace("T", " ");
                  if (location.hash.length > 1) $("#q").value = location.hash.slice(1);
                  render($("#q").value);
                  renderChips();
          } catch (err) {
                  list.replaceChildren();
                  $("#empty").hidden = false;
                  $("#empty").textContent = "목록을 불러오지 못했어요. 잠시 후 새로고침해 주세요.";
          }
    }

   $("#q").addEventListener("input", (e) => render(e.target.value));
    $("#clear").addEventListener("click", () => { $("#q").value = ""; $("#q").focus(); render(""); });
    boot();
})();
