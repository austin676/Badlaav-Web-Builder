document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('canvas');
  const propertyForm = document.getElementById('property-form');
  const noElementSelected = document.getElementById('no-element-selected');
  const previewBtn = document.getElementById('preview-btn');
  const exportBtn = document.getElementById('export-btn');

  let selectedElement = null;
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  document.querySelectorAll('.button').forEach(item => {
    item.addEventListener('dragstart', function (e) {
      e.dataTransfer.setData('type', e.target.dataset.type);
    });
  });

  canvas.addEventListener('dragover', function (e) {
    e.preventDefault();
  });

  canvas.addEventListener('drop', function (e) {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addElement(type, x, y);
  });

  canvas.addEventListener('click', function () {
    if (selectedElement && !isDragging) {
      selectedElement.classList.remove('selected');
      selectedElement = null;
      propertyForm.style.display = 'none';
      noElementSelected.style.display = 'block';
    }
  });

  function addElement(type, x, y) {
    const el = document.createElement('div');
    el.className = 'canvas-element ' + type + '-element';
    el.style.left = x + 'px';
    el.style.top = y + 'px';

    if (type === 'text') {
      el.textContent = 'Double click to edit';
      el.contentEditable = true;
    } else if (type === 'button') {
      el.textContent = 'Click Me';
      el.style.backgroundColor = '#e84855';
      el.style.color = 'white';
      el.style.padding = '10px 20px';
      el.style.borderRadius = '5px';
      el.style.textAlign = 'center';
    } else if (type === 'image') {
      el.innerHTML = '<img src="https://via.placeholder.com/150" style="max-width:100%">';
    }

    el.addEventListener('click', function (e) {
      e.stopPropagation();
      select(el);
    });

    el.addEventListener('mousedown', function (e) {
      isDragging = true;
      selectedElement = el;
      const rect = el.getBoundingClientRect();
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;
    });

    canvas.appendChild(el);
    select(el);
  }

  document.addEventListener('mousemove', function (e) {
    if (!isDragging || !selectedElement) return;
    selectedElement.style.left = (e.clientX - dragOffsetX) + 'px';
    selectedElement.style.top = (e.clientY - dragOffsetY) + 'px';
  });

  document.addEventListener('mouseup', function () {
    isDragging = false;
  });

  const elementContent = document.getElementById('element-content');
  const elementFontSize = document.getElementById('element-font-size');
  const elementColor = document.getElementById('element-color');
  const elementImageUrl = document.getElementById('element-image-url');
  const elementBgColor = document.getElementById('element-bg-color');
  const deleteElementBtn = document.getElementById('delete-element');

  elementContent.addEventListener('input', update);
  elementFontSize.addEventListener('change', update);
  elementColor.addEventListener('input', update);
  elementImageUrl.addEventListener('input', update);
  elementBgColor.addEventListener('input', update);
  deleteElementBtn.addEventListener('click', remove);
  previewBtn.addEventListener('click', function () {
    alert('Preview feature');
  });
  exportBtn.addEventListener('click', function () {
    alert('Export feature');
  });

  function select(el) {
    if (selectedElement) {
      selectedElement.classList.remove('selected');
    }

    selectedElement = el;
    el.classList.add('selected');
    propertyForm.style.display = 'block';
    noElementSelected.style.display = 'none';

    const type = el.classList.contains('text-element') ? 'text' :
                 el.classList.contains('button-element') ? 'button' : 'image';

    document.getElementById('image-url-group').style.display = type === 'image' ? 'block' : 'none';
    document.getElementById('button-bg-group').style.display = type === 'button' ? 'block' : 'none';

    if (type === 'text' || type === 'button') {
      elementContent.value = el.textContent;
      elementFontSize.value = el.style.fontSize || '16px';
      elementColor.value = toHex(el.style.color || 'black');
      if (type === 'button') {
        elementBgColor.value = toHex(el.style.backgroundColor || '#e84855');
      }
    } else if (type === 'image') {
      const img = el.querySelector('img');
      elementImageUrl.value = img ? img.src : '';
    }
  }

  function update() {
    if (!selectedElement) return;

    const type = selectedElement.classList.contains('text-element') ? 'text' :
                 selectedElement.classList.contains('button-element') ? 'button' : 'image';

    if (type === 'text' || type === 'button') {
      selectedElement.textContent = elementContent.value;
      selectedElement.style.fontSize = elementFontSize.value;
      selectedElement.style.color = elementColor.value;
      if (type === 'button') {
        selectedElement.style.backgroundColor = elementBgColor.value;
      }
    } else if (type === 'image') {
      const img = selectedElement.querySelector('img');
      img.src = elementImageUrl.value;
    }
  }

  function remove() {
    if (selectedElement) {
      selectedElement.remove();
      selectedElement = null;
      propertyForm.style.display = 'none';
      noElementSelected.style.display = 'block';
    }
  }

   function toHex(rgb) {
    const result = rgb.match(/\d+/g); 
    if (!result || result.length < 3) return rgb;

    const r = parseInt(result[0]).toString(16).padStart(2, '0');
    const g = parseInt(result[1]).toString(16).padStart(2, '0');
    const b = parseInt(result[2]).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
}
});
