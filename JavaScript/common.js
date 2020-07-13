function generateNewId() {
  return Math.random().toString().substr(2, 7);
}

function insertData(array, draggedElObjectId, afterDraggedElObjectId) {
  if (!afterDraggedElObjectId) {
    let oldIndex = array.findIndex((obj) => obj.id === draggedElObjectId);
    let newIndex = array.length - 1;
    return moveDataInArray(array, oldIndex, newIndex);
  } else {
    let oldIndex = array.findIndex((obj) => obj.id === draggedElObjectId);
    let newIndex = array.findIndex((obj) => obj.id === afterDraggedElObjectId);
    return moveDataInArray2(array, oldIndex, newIndex);
  }
}

function moveDataInArray(arr, old_index, new_index) {
  let newEl = arr.splice(old_index, 1)[0];
  return arr.splice(new_index, 0, newEl);
}

function moveDataInArray2(arr, oldIndex, newIndex) {
  if (newIndex > oldIndex) {
    arr.splice(newIndex, 0, arr[oldIndex]);
    arr.splice(oldIndex, 1);
  } else if (newIndex < oldIndex) {
    arr.splice(newIndex, 0, arr[oldIndex]);
    arr.splice(oldIndex + 1, 1);
  } else if (newIndex === newIndex) {
    arr.splice(newIndex, 0, arr[oldIndex]);
  }
}

function removeTargetCardData(array, targetDataId) {
  for (let index in array) {
    if (+array[index].id === +targetDataId) {
      return array.splice(index, 1);
    }
  }
  return false;
}

function insertTargetDataInArray(array, targetElDataId, dataToAdd) {
  if (!targetElDataId) {
    array.push(dataToAdd);
  } else {
    let index = array.findIndex((el) => +el.id === +targetElDataId);
    debugger;
    array.splice(index, 0, dataToAdd);
  }
}

function arrangeDataInSameList(
  arr,
  targetListId,
  draggedElObjectId,
  afterDraggedElObjectId
) {
  let cardList = arr.find((list) => +list.id === +targetListId).cards;
  insertData(cardList, draggedElObjectId, afterDraggedElObjectId);
}

function inserToAnotherList(listsArray, originListId, destinationListId, draggedElObjectId, afterDraggedElObjectId) {
  let originCardList = listsArray.find((list) => +list.id === +originListId).cards;
  let destinationCardList = listsArray.find((list) => +list.id === +destinationListId).cards;
  debugger;
  let data = removeTargetCardData(originCardList, draggedElObjectId);
  insertTargetDataInArray(destinationCardList, afterDraggedElObjectId, data[0]);
}