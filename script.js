"use strict";

let stickersBlock = document.querySelector(".stickers");
let infomsg = stickersBlock.querySelector(".stickers_infomsg");

let stickerFieldText = document.querySelector(".stickers__form_text");
let stickerFieldBgColor = document.querySelector("#sticker_color-bg");
let stickerFieldFontColor = document.querySelector("#sticker_color-font");

let btnAdd = document.querySelector(".btn-add");
let btnSave = document.querySelector(".btn-save");
let btnCancel = document.querySelector(".btn-cancel");

let stickersWrap = document.querySelector("#stickersWrapper");

let stickersJson = localStorage.getItem("stickers");
let stickers = stickersJson ? JSON.parse(stickersJson) : [];

stickers.forEach((s) => createSticker(s));

btnAdd.addEventListener("click", function () {
  let idSticker =
    stickers.length > 0 ? stickers[stickers.length - 1].id + 1 : 1;

  if (
    stickerFieldText.value.length < 3 ||
    stickerFieldText.value.length > 130
  ) {
    return showMessage("error", "Sticker text must be 3–130 characters!");
  }

  let sticker = {
    id: idSticker,
    text: stickerFieldText.value,
    bgColor: stickerFieldBgColor.value,
    fontColor: stickerFieldFontColor.value,
    done: false,
  };

  stickers.push(sticker);
  createSticker(sticker);
  localStorage.setItem("stickers", JSON.stringify(stickers));
  resetForm();
  showMessage("success", "Sticker added!");
});

btnSave.addEventListener("click", function () {
  let id = +this.dataset.idsticker;
  let sticker = stickers.find((s) => s.id === id);
  if (!sticker) return;

  if (
    stickerFieldText.value.length < 3 ||
    stickerFieldText.value.length > 130
  ) {
    return showMessage("error", "Sticker text must be 3–130 characters!");
  }

  sticker.text = stickerFieldText.value;
  sticker.bgColor = stickerFieldBgColor.value;
  sticker.fontColor = stickerFieldFontColor.value;

  localStorage.setItem("stickers", JSON.stringify(stickers));

  let el = stickersWrap.querySelector(`[data-idsticker="${id}"]`);
  el.firstChild.textContent = sticker.text;
  el.style.backgroundColor = sticker.bgColor;
  el.style.color = sticker.fontColor;

  resetForm();
  showMessage("success", "Sticker updated!");
});

btnCancel.addEventListener("click", resetForm);

function createSticker(sticker) {
  let el = document.createElement("div");
  el.classList.add("sticker");

  if (sticker.done) el.classList.add("line-through", "opacity");

  el.dataset.idsticker = sticker.id;
  el.textContent = sticker.text;

  el.style.backgroundColor = sticker.bgColor;
  el.style.color = sticker.fontColor;
  el.style.transform = `rotate(${getRandomInt(-8, 8)}deg)`;

  createControlsEl(
    el,
    "button",
    ["sticker_control", "sticker_remove"],
    "✖",
    () => {
      if (confirm("Delete this sticker?")) {
        el.remove();
        stickers = stickers.filter((s) => s.id !== sticker.id);
        localStorage.setItem("stickers", JSON.stringify(stickers));
        showMessage("success", "Sticker deleted!");
        resetForm();
      }
    }
  );

  createControlsEl(
    el,
    "button",
    ["sticker_control", "sticker_done"],
    "✔",
    () => {
      el.classList.toggle("line-through");
      el.classList.toggle("opacity");

      let obj = stickers.find((s) => s.id === sticker.id);
      obj.done = !obj.done;
      localStorage.setItem("stickers", JSON.stringify(stickers));
    }
  );

  el.addEventListener("click", (e) => {
    if (e.target.classList.contains("sticker_control")) return;

    stickerFieldText.value = sticker.text;
    stickerFieldBgColor.value = sticker.bgColor;
    stickerFieldFontColor.value = sticker.fontColor;

    btnAdd.classList.add("hide");
    btnSave.classList.remove("hide");
    btnCancel.classList.remove("hide");

    btnSave.dataset.idsticker = sticker.id;
  });

  stickersWrap.appendChild(el);
}

function createControlsEl(parent, tag, classes, text, func) {
  let el = document.createElement(tag);
  el.classList.add(...classes);
  el.textContent = text;
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    func();
  });
  parent.appendChild(el);
}

function resetForm() {
  stickerFieldText.value = "";
  stickerFieldBgColor.value = "#000000";
  stickerFieldFontColor.value = "#ffffff";
  stickerFieldText.focus();

  btnAdd.classList.remove("hide");
  btnSave.classList.add("hide");
  btnCancel.classList.add("hide");

  btnSave.dataset.idsticker = null;
}

function showMessage(type, text) {
  infomsg.textContent = text;
  infomsg.classList.add(type);
  setTimeout(() => {
    infomsg.classList.remove(type);
  }, 2500);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
