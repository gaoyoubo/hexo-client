class HexoClient {
  /**
   * 文本框光标位置插入文字
   * @param editor
   * @param str
   */
  insertText (editor, str) {
    if (document.selection) {
      var sel = document.selection.createRange()
      sel.text = str
    } else if (typeof editor.selectionStart === 'number' && typeof editor.selectionEnd === 'number') {
      var startPos = editor.selectionStart
      var endPos = editor.selectionEnd
      var cursorPos = startPos
      var tmpStr = editor.value
      editor.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length)
      cursorPos += str.length
      editor.selectionStart = editor.selectionEnd = cursorPos
    } else {
      editor.value += str
    }
    return editor.value
  }
}

export default new HexoClient()
