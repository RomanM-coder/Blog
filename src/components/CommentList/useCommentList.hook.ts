// hooks/useCommentStates.ts
import { useState } from 'react'

export const useCommentList = () => {
  const [commentStates, setCommentStates] = useState<Record<string, boolean>>(
    {},
  )

  // const setShowChild = (commentId: string, isOpen: boolean) => {
  //   setCommentStates((prev) => ({
  //     ...prev,
  //     [commentId]: isOpen,
  //   }))
  // }

  const getShowChild = (commentId: string): boolean => {
    return commentStates[commentId] || false
  }

  const toggleShowChild = (commentId: string) => {
    setCommentStates((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }))
  }

  return {
    // commentStates,
    // setShowChild,
    getShowChild,
    toggleShowChild,
  }
}
