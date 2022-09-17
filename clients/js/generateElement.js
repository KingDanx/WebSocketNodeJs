//General use function for creating a DOM element
export function generateElement(
  parentEl = document.body,
  type = "div",
  id = "",
  classStr = "",
  content = "",
  attribute = null,
  attributeValue = null,
  attribute2 = null,
  attribute2Value = null
) {
  let el = document.createElement(type);
  el.id = id;
  el.className = classStr;
  el.setAttribute(attribute, attributeValue);
  el.setAttribute(attribute2, attribute2Value);
  if (typeof content == "string") el.innerHTML = content;
  else if (typeof content == "object") el.appendChild(content);
  if (isDefined(parentEl)) parentEl.appendChild(el);
  return el;
}
function isDefined(obj) {
  return obj !== undefined && obj != null;
}
