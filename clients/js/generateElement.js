//General use function for creating a DOM element
export function generateElement(
  parentEl = document.body,
  type = "div",
  id = null,
  classStr = null,
  content = "",
  attribute = null,
  attributeValue = null,
  attribute2 = null,
  attribute2Value = null
) {
  let el = document.createElement(type);
  id == null ? null : (el.id = id);
  classStr == null ? null : (el.className = classStr);
  attribute == null ? null : el.setAttribute(attribute, attributeValue);
  attribute2 == null ? null : el.setAttribute(attribute2, attribute2Value);

  if (typeof content == "string") el.innerHTML = content;
  else if (typeof content == "object") el.appendChild(content);
  if (isDefined(parentEl)) parentEl.appendChild(el);
  return el;
}

export function isDefined(obj) {
  return obj !== undefined && obj != null;
}

export function removeUnusedElements(elementIdToRemove, elementCheck, array) {
  if (
    isDefined(document.getElementById(elementIdToRemove)) &&
    !array.includes(elementCheck)
  ) {
    document.getElementById(elementIdToRemove).remove();
  }
}

export function generateMappedElements(
  elementId,
  parentElement,
  content,
  elementType = "div"
) {
  if (!isDefined(document.getElementById(elementId)))
    generateElement(
      document.getElementById(parentElement),
      elementType,
      elementId,
      undefined,
      content
    );
}
