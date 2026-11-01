// Tambahan link profil pengguna: https://HOST/@username
// Dipasang SEBELUM script utama di index.html dan 404.html. Hanya aktif bila path diawali "/@".
(function () {
  'use strict';

  var seg = location.pathname.split("/").filter(Boolean)[0] || "";
  if (seg.charAt(0) !== "@") return;

  var name = seg.slice(1);
  try { name = decodeURIComponent(name); } catch (e) { }
  name = name.replace(/\s+/g, "").slice(0, 40);
  if (!name) return;

  // Cegah script utama memulihkan link terakhir saat halaman dimuat ulang
  try { localStorage.removeItem("dp_last"); } catch (e) { }

  var PACKAGE = "com.dispetch.app";
  var isAndroid = /Android/i.test(navigator.userAgent);

  function $(id) { return document.getElementById(id); }

  function apply() {
    // Dijalankan setelah script utama selesai, jadi tampilan "link tidak valid" miliknya ditimpa di sini
    $("s1").classList.remove("y");

    var avatar = $("t1");
    avatar.textContent = (name.charAt(0) || "?").toUpperCase();
    avatar.style.fontSize = "56px";
    avatar.style.fontWeight = "800";

    $("h1").textContent = "@" + name;
    $("v1").textContent = "Profil pengguna";
    $("u1").hidden = true;
    document.title = "@" + name + " \u00B7 DISPETCH";

    var note = document.querySelector(".z1 p");
    if (note) note.textContent = "Belum punya aplikasi DISPETCH? Unduh dulu, lalu buka lagi link ini untuk melihat profil.";

    // Tautan unduh milik script utama dipakai sebagai tujuan cadangan bila aplikasi belum terpasang
    var install = document.querySelector("[data-install]");
    var fallback = install ? install.href : "";

    var link;
    if (isAndroid) {
      link = "intent://" + location.host + location.pathname + location.search +
        "#Intent;scheme=https;package=" + PACKAGE + ";" +
        (fallback ? "S.browser_fallback_url=" + encodeURIComponent(fallback) + ";" : "") + "end";
    } else {
      link = fallback || "#";
    }
    ["q1", "m1", "f1", "w1"].forEach(function (id) {
      var a = $(id);
      if (a) a.href = link;
    });

    var open = $("w1");
    open.hidden = false;
    open.textContent = isAndroid ? "Buka profil di DISPETCH" : "Unduh DISPETCH";

    var help = $("x1");
    help.hidden = false;
    help.textContent = isAndroid
      ? "Kalau aplikasi tidak terbuka otomatis, ketuk tombol di atas."
      : "Buka link ini dari HP Android yang sudah terpasang DISPETCH untuk melihat profil.";

    // Buka aplikasi otomatis satu kali per sesi, supaya tidak berputar bila aplikasi belum terpasang
    if (!isAndroid) return;
    var key = "dp_auto_u_" + name.toLowerCase();
    var tried = false;
    try { tried = sessionStorage.getItem(key) === "1"; } catch (e) { }
    if (tried) return;
    try { sessionStorage.setItem(key, "1"); } catch (e) { }
    setTimeout(function () {
      if (!document.hidden) location.href = link;
    }, 350);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})();
