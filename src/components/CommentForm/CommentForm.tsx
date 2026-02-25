import React, { useState, useRef, useEffect } from 'react'
import { useDebounce } from '../../utilita/useDebounce.ts'
import { useTranslation } from 'react-i18next'
import styles from './CommentForm.module.css'

interface ICommentFormProps {
  handleCloseForm: (show: boolean) => void
  showChild: boolean
  commentWritgh: string
  setCommentWritgh: (commWritgh: string) => void
  // related: string | null
  parent: boolean
  addNewComment: (comm: string) => void
  depth: number
  handleUseGetPost_AfterAddNewComment: () => void
}

export const CommentForm: React.FC<ICommentFormProps> = ({
  handleCloseForm,
  showChild,
  commentWritgh,
  setCommentWritgh,
  // related,
  parent,
  addNewComment,
  depth,
  handleUseGetPost_AfterAddNewComment,
}) => {
  const [focusForm, setFocusForm] = useState(false)
  const commentRef = useRef<HTMLDivElement>(null)

  const [charCount, setCharCount] = useState(0)
  const MAX_LENGTH = 1000

  const debouncedComment = useDebounce(commentWritgh, true, 150)
  const { t } = useTranslation()

  const handleInput = () => {
    let content = commentRef.current?.innerText.trim() || ''

    //Принудительно очищаем contentEditable если там только невидимые символы
    if (
      content.trim() === '' &&
      commentRef.current?.innerHTML.includes('<br>')
    ) {
      commentRef.current.innerHTML = ''
    }

    // Если превышен лимит - обрезаем текст
    if (content.length > MAX_LENGTH) {
      content = content.slice(0, MAX_LENGTH)

      // Обновляем содержимое элемента
      if (commentRef.current) {
        commentRef.current.innerText = content

        // Перемещаем курсор в конец
        const range = document.createRange()
        const selection = window.getSelection()
        range.selectNodeContents(commentRef.current)
        range.collapse(false) // false - в конец
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }

    setCommentWritgh(content)
    setCharCount(content.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Блокируем ввод при достижении лимита (кроме служебных клавиш)
    if (
      charCount >= MAX_LENGTH &&
      e.key.length === 1 && // обычные символы
      !e.ctrlKey &&
      !e.metaKey && // не Ctrl+C/V и т.д.
      e.key !== 'Backspace' &&
      e.key !== 'Delete' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'ArrowRight' &&
      e.key !== 'ArrowUp' &&
      e.key !== 'ArrowDown' &&
      e.key !== 'Tab'
    ) {
      e.preventDefault()
      return
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')

    // Ограничиваем вставляемый текст
    const remainingChars = MAX_LENGTH - charCount
    let pasteText = text

    if (text.length > remainingChars) {
      pasteText = text.slice(0, remainingChars)
    }

    // Вставляем текст в contentEditable
    if (commentRef.current) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()

        const textNode = document.createTextNode(pasteText)
        range.insertNode(textNode)

        range.setStartAfter(textNode)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        commentRef.current.textContent += pasteText
      }

      // Обновляем состояние
      handleInput()
    }
  }

  const handleSubmit = () => {
    const newComment = commentWritgh.trim()
    if (newComment.length === 0) return
    console.log('Отправка комментария:', commentWritgh)

    // Очищаем черновик после успешной отправки
    try {
      localStorage.removeItem('commentDraft')
      console.log('Черновик очищен после отправки')
    } catch (error) {
      console.error('Ошибка очистки черновика:', error)
    }

    if (commentRef.current) {
      commentRef.current.innerText = ''
      setCommentWritgh('')
      setCharCount(0)
    }

    // handleCloseForm(false)
    addNewComment(newComment)
    handleUseGetPost_AfterAddNewComment()
    handleCloseForm(false)
  }

  const handleCancel = () => {
    setCommentWritgh('')
    try {
      localStorage.removeItem('commentDraft')
      console.log('Черновик очищен после cansel')
    } catch (error) {
      console.error('Ошибка очистки черновика:', error)
    }
    handleCloseForm(false)
  }

  const handleFocus = () => {
    console.log('Focus on comment input')
    setFocusForm(true)
  }
  const handleBlur = () => {
    console.log('Blur from comment input')
    setFocusForm(false)
  }

  // Восстановление черновика при загрузке компонента
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('commentDraft')
      if (savedDraft && commentRef.current) {
        commentRef.current.textContent = savedDraft
        setCommentWritgh(savedDraft)
        setCharCount(savedDraft.length)
        console.log('Черновик восстановлен из LocalStorage')
      }
    } catch (error) {
      console.error('Ошибка восстановления из LocalStorage:', error)
    }
  }, [])

  // Автосохранение при изменении debouncedComment
  useEffect(() => {
    if (debouncedComment.trim()) {
      try {
        localStorage.setItem('commentDraft', debouncedComment)
        console.log('Комментарий автосохранен')
      } catch (error) {
        console.error('Ошибка автосохранения:', error)
      }
    } else {
      localStorage.removeItem('commentDraft')
    }
  }, [debouncedComment])

  return (
    <div
      className={styles.commentForm}
      // style={{ gridTemplateColumns: related ? '26px 1fr' : '1fr' }}
      style={{ gridTemplateColumns: depth === 0 ? '1fr' : '26px 1fr' }}
    >
      {depth > 0 && (
        <div className={styles.commentBranches}>
          <div
            // className={`styles.commentBranch ${
            //   related ? styles.noLeftBorder : styles.hasLeftBorder
            // }`}
            className={`styles.commentBranch ${
              parent && !showChild ? styles.noLeftBorder : styles.hasLeftBorder
            }`}
          >
            <div className={styles.commentBranchArc}></div>
          </div>
        </div>
      )}
      <div
        className={styles.inputWrapper}
        // style={{ paddingTop: related ? '12px' : '0px' }}
        style={{ paddingTop: depth === 0 ? '12px' : '0px' }}
      >
        <div
          className={`${styles.inputContainer} ${
            focusForm ? styles.focused : ''
          }`}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <div
            ref={commentRef}
            contentEditable="true"
            data-placeholder={t('commentForm.comment')}
            className={styles.commentInput}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          />
          <div className={styles.commentForm_footer}>
            <div>{t('commentForm.reactions')}</div>
            <div className={styles.action}>
              {parent && (
                <button onClick={handleCancel} className={styles.cancelButton}>
                  {t('commentForm.cancel')}
                </button>
              )}
              {commentWritgh !== '' && (
                <button
                  onClick={handleSubmit}
                  className={styles.submitButton}
                  // disabled={!comment.trim()} // Кнопка неактивна при пустом комментарии
                >
                  {t('commentForm.submit')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
